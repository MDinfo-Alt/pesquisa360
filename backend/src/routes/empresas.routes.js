import pool from "../db/connection.js";
import { idParam } from "../schemas.js";

const STATUS = [
    "PROSPECTADO",
    "ENTREVISTA_REALIZADA",
    "EM_ANALISE",
    "SOLUCAO_PREPARADA",
    "APRESENTACAO_REALIZADA",
    "CLIENTE",
    "SEM_INTERESSE"
];

const campos = {
    segmento_id: { type: "integer" },
    nome: { type: "string", minLength: 1, maxLength: 150 },
    telefone_whatsapp: { type: "string", maxLength: 30 },
    endereco: { type: "string", maxLength: 200 },
    bairro: { type: "string", maxLength: 100 },
    cidade: { type: "string", maxLength: 100 },
    site: { type: "string", maxLength: 255 },
    instagram: { type: "string", maxLength: 255 },
    qtd_funcionarios: { type: "integer" },
    observacoes: { type: "string" },
    status: { type: "string", enum: STATUS }
};

export default async function empresasRoutes(app) {

    app.get(
        "/empresas",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        busca: { type: "string" },
                        status: { type: "string", enum: STATUS },
                        segmento_id: { type: "integer" }
                    }
                }
            }
        },
        async (request) => {
            const { busca, status, segmento_id } = request.query;

            const result = await pool.query(
                `
                SELECT e.*, s.nome AS segmento
                FROM empresas e
                JOIN segmentos s ON s.id = e.segmento_id
                WHERE ($1::text IS NULL OR e.nome ILIKE '%' || $1 || '%')
                  AND ($2::text IS NULL OR e.status = $2)
                  AND ($3::int IS NULL OR e.segmento_id = $3)
                ORDER BY e.nome
                `,
                [busca ?? null, status ?? null, segmento_id ?? null]
            );

            return result.rows;
        }
    );

    // Empresa com contatos e entrevistas — é a tela de detalhe do pesquisador.
    app.get("/empresas/:id", { schema: { params: idParam() } }, async (request, reply) => {
        const { id } = request.params;

        const empresa = await pool.query(
            `
            SELECT e.*, s.nome AS segmento
            FROM empresas e
            JOIN segmentos s ON s.id = e.segmento_id
            WHERE e.id = $1
            `,
            [id]
        );

        if (empresa.rows.length === 0) {
            return reply.code(404).send({ message: "Empresa não encontrada" });
        }

        const contatos = await pool.query(
            "SELECT * FROM contatos WHERE empresa_id = $1 ORDER BY nome",
            [id]
        );

        const entrevistas = await pool.query(
            `
            SELECT e.id, e.data_entrevista, e.observacoes, c.nome AS contato
            FROM entrevistas e
            LEFT JOIN contatos c ON c.id = e.contato_id
            WHERE e.empresa_id = $1
            ORDER BY e.data_entrevista DESC
            `,
            [id]
        );

        return {
            ...empresa.rows[0],
            contatos: contatos.rows,
            entrevistas: entrevistas.rows
        };
    });

    app.post(
        "/empresas",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["segmento_id", "nome"],
                    properties: {
                        ...campos,
                        // RN06: duplicidade alerta, não bloqueia.
                        permitir_duplicado: { type: "boolean" }
                    }
                }
            }
        },
        async (request, reply) => {
            const { permitir_duplicado, ...dados } = request.body;

            if (!permitir_duplicado) {
                const existing = await pool.query(
                    `
                    SELECT id, nome, cidade
                    FROM empresas
                    WHERE LOWER(nome) = LOWER($1)
                      AND (LOWER(cidade) = LOWER($2) OR ($2 IS NULL AND cidade IS NULL))
                    LIMIT 1
                    `,
                    [dados.nome, dados.cidade ?? null]
                );

                if (existing.rows.length > 0) {
                    return reply.code(409).send({
                        message:
                            "Possível empresa duplicada. Envie permitir_duplicado: true para cadastrar mesmo assim.",
                        empresa: existing.rows[0]
                    });
                }
            }

            const result = await pool.query(
                `
                INSERT INTO empresas (
                    segmento_id, nome, telefone_whatsapp, endereco, bairro,
                    cidade, site, instagram, qtd_funcionarios, observacoes, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, 'PROSPECTADO'))
                RETURNING *
                `,
                [
                    dados.segmento_id,
                    dados.nome,
                    dados.telefone_whatsapp ?? null,
                    dados.endereco ?? null,
                    dados.bairro ?? null,
                    dados.cidade ?? null,
                    dados.site ?? null,
                    dados.instagram ?? null,
                    dados.qtd_funcionarios ?? null,
                    dados.observacoes ?? null,
                    dados.status ?? null
                ]
            );

            return reply.code(201).send(result.rows[0]);
        }
    );

    app.patch(
        "/empresas/:id",
        {
            schema: {
                params: idParam(),
                body: {
                    type: "object",
                    minProperties: 1,
                    // obrigatório: o SET é montado com as chaves do body
                    additionalProperties: false,
                    properties: campos
                }
            }
        },
        async (request, reply) => {
            const entradas = Object.entries(request.body);

            // Fastify remove campos desconhecidos, então o body pode chegar vazio.
            if (entradas.length === 0) {
                return reply.code(400).send({ message: "Nenhum campo válido informado" });
            }

            const set = entradas
                .map(([campo], i) => `${campo} = $${i + 2}`)
                .join(", ");

            const result = await pool.query(
                `
                UPDATE empresas
                SET ${set}, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING *
                `,
                [request.params.id, ...entradas.map(([, valor]) => valor)]
            );

            if (result.rows.length === 0) {
                return reply.code(404).send({ message: "Empresa não encontrada" });
            }

            return result.rows[0];
        }
    );
}
