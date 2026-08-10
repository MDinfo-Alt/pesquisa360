import pool from "../db/connection.js";
import { idParam } from "../schemas.js";

// RN08 (RF03): a resposta precisa bater com o tipo configurado na pergunta.
export function validarResposta({ tipo_resposta, texto }, resposta) {
    const opcoes = resposta.opcoes ?? [];
    const valor = resposta.valor;

    switch (tipo_resposta) {
        case "NUMERO":
            if (valor === undefined || Number.isNaN(Number(valor))) {
                return `A pergunta "${texto}" espera um número.`;
            }
            break;

        case "SIM_NAO":
            if (!["SIM", "NAO"].includes(String(valor).toUpperCase())) {
                return `A pergunta "${texto}" espera SIM ou NAO.`;
            }
            break;

        case "SELECAO_UNICA":
            if (opcoes.length !== 1) {
                return `A pergunta "${texto}" espera exatamente uma opção.`;
            }
            break;

        case "MULTIPLA_SELECAO":
            if (opcoes.length === 0) {
                return `A pergunta "${texto}" espera ao menos uma opção.`;
            }
            break;

        default: // TEXTO
            if (valor === undefined || String(valor).trim() === "") {
                return `A pergunta "${texto}" espera um texto.`;
            }
    }

    return null;
}

export default async function entrevistasRoutes(app) {

    app.get("/empresas/:empresaId/entrevistas", { schema: { params: idParam("empresaId") } }, async (request) => {
        const result = await pool.query(
            `
            SELECT e.*, c.nome AS contato
            FROM entrevistas e
            LEFT JOIN contatos c ON c.id = e.contato_id
            WHERE e.empresa_id = $1
            ORDER BY e.data_entrevista DESC
            `,
            [request.params.empresaId]
        );

        return result.rows;
    });

    // Entrevista com respostas e dores — tela de leitura da pesquisa.
    app.get("/entrevistas/:id", { schema: { params: idParam() } }, async (request, reply) => {
        const { id } = request.params;

        const entrevista = await pool.query(
            `
            SELECT e.*, emp.nome AS empresa, c.nome AS contato
            FROM entrevistas e
            JOIN empresas emp ON emp.id = e.empresa_id
            LEFT JOIN contatos c ON c.id = e.contato_id
            WHERE e.id = $1
            `,
            [id]
        );

        if (entrevista.rows.length === 0) {
            return reply.code(404).send({ message: "Entrevista não encontrada" });
        }

        const respostas = await pool.query(
            `
            SELECT
                r.id,
                r.pergunta_id,
                p.texto AS pergunta,
                p.tipo_resposta,
                r.valor,
                COALESCE(
                    JSON_AGG(op.texto) FILTER (WHERE op.id IS NOT NULL),
                    '[]'
                ) AS opcoes
            FROM respostas r
            JOIN perguntas p ON p.id = r.pergunta_id
            LEFT JOIN opcoes_respostas orp ON orp.resposta_id = r.id
            LEFT JOIN opcoes_perguntas op ON op.id = orp.opcao_pergunta_id
            WHERE r.entrevista_id = $1
            GROUP BY r.id, p.texto, p.tipo_resposta, p.ordem
            ORDER BY p.ordem
            `,
            [id]
        );

        const dores = await pool.query(
            `
            SELECT d.*, c.nome AS categoria
            FROM dores d
            JOIN categorias_dores c ON c.id = d.categoria_id
            WHERE d.entrevista_id = $1
            ORDER BY d.id
            `,
            [id]
        );

        return {
            ...entrevista.rows[0],
            respostas: respostas.rows,
            dores: dores.rows
        };
    });

    app.post(
        "/entrevistas",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["empresa_id", "data_entrevista"],
                    properties: {
                        empresa_id: { type: "integer" },
                        contato_id: { type: "integer", nullable: true },
                        data_entrevista: { type: "string", format: "date" },
                        observacoes: { type: "string" },
                        respostas: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["pergunta_id"],
                                properties: {
                                    pergunta_id: { type: "integer" },
                                    valor: { type: "string" },
                                    opcoes: {
                                        type: "array",
                                        items: { type: "integer" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            const {
                empresa_id,
                contato_id,
                data_entrevista,
                observacoes,
                respostas = []
            } = request.body;

            if (respostas.length > 0) {
                const perguntas = await pool.query(
                    "SELECT id, texto, tipo_resposta FROM perguntas WHERE id = ANY($1)",
                    [respostas.map((r) => r.pergunta_id)]
                );

                const porId = new Map(perguntas.rows.map((p) => [p.id, p]));

                for (const resposta of respostas) {
                    const pergunta = porId.get(resposta.pergunta_id);

                    if (!pergunta) {
                        return reply.code(400).send({
                            message: `Pergunta ${resposta.pergunta_id} não existe.`
                        });
                    }

                    const erro = validarResposta(pergunta, resposta);

                    if (erro) {
                        return reply.code(400).send({ message: erro });
                    }
                }
            }

            const client = await pool.connect();

            try {
                await client.query("BEGIN");

                const entrevista = await client.query(
                    `
                    INSERT INTO entrevistas (empresa_id, contato_id, data_entrevista, observacoes)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    `,
                    [empresa_id, contato_id ?? null, data_entrevista, observacoes ?? null]
                );

                const entrevistaId = entrevista.rows[0].id;

                for (const resposta of respostas) {
                    const salva = await client.query(
                        `
                        INSERT INTO respostas (entrevista_id, pergunta_id, valor)
                        VALUES ($1, $2, $3)
                        RETURNING id
                        `,
                        [entrevistaId, resposta.pergunta_id, resposta.valor ?? null]
                    );

                    for (const opcaoId of resposta.opcoes ?? []) {
                        await client.query(
                            `
                            INSERT INTO opcoes_respostas (resposta_id, opcao_pergunta_id)
                            VALUES ($1, $2)
                            `,
                            [salva.rows[0].id, opcaoId]
                        );
                    }
                }

                await client.query(
                    `
                    UPDATE empresas
                    SET status = 'ENTREVISTA_REALIZADA', updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1 AND status = 'PROSPECTADO'
                    `,
                    [empresa_id]
                );

                await client.query("COMMIT");

                return reply.code(201).send(entrevista.rows[0]);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        }
    );
}
