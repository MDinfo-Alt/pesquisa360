import pool from "../db/connection.js";
import { idParam } from "../schemas.js";

export default async function doresRoutes(app) {

    // Todas as dores, filtráveis — é a base da análise do pesquisador.
    app.get(
        "/dores",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        empresa_id: { type: "integer" },
                        entrevista_id: { type: "integer" },
                        categoria_id: { type: "integer" }
                    }
                }
            }
        },
        async (request) => {
            const { empresa_id, entrevista_id, categoria_id } = request.query;

            const result = await pool.query(
                `
                SELECT
                    d.*,
                    c.nome AS categoria,
                    emp.id AS empresa_id,
                    emp.nome AS empresa
                FROM dores d
                JOIN categorias_dores c ON c.id = d.categoria_id
                JOIN entrevistas e ON e.id = d.entrevista_id
                JOIN empresas emp ON emp.id = e.empresa_id
                WHERE ($1::int IS NULL OR emp.id = $1)
                  AND ($2::int IS NULL OR d.entrevista_id = $2)
                  AND ($3::int IS NULL OR d.categoria_id = $3)
                ORDER BY d.id DESC
                `,
                [empresa_id ?? null, entrevista_id ?? null, categoria_id ?? null]
            );

            return result.rows;
        }
    );

    app.get("/dores/:id", { schema: { params: idParam() } }, async (request, reply) => {
        const dor = await pool.query(
            `
            SELECT d.*, c.nome AS categoria
            FROM dores d
            JOIN categorias_dores c ON c.id = d.categoria_id
            WHERE d.id = $1
            `,
            [request.params.id]
        );

        if (dor.rows.length === 0) {
            return reply.code(404).send({ message: "Dor não encontrada" });
        }

        const solucoes = await pool.query(
            `
            SELECT s.*
            FROM solucoes s
            JOIN dores_solucoes ds ON ds.solucao_id = s.id
            WHERE ds.dor_id = $1
            ORDER BY s.id
            `,
            [request.params.id]
        );

        return { ...dor.rows[0], solucoes: solucoes.rows };
    });

    app.post(
        "/dores",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["entrevista_id", "categoria_id", "titulo", "descricao"],
                    properties: {
                        entrevista_id: { type: "integer" },
                        categoria_id: { type: "integer" },
                        titulo: { type: "string", minLength: 1, maxLength: 150 },
                        descricao: { type: "string", minLength: 1 },
                        frequencia: { type: "string", maxLength: 30 },
                        impacto: { type: "string", maxLength: 30 },
                        solucao_atual: { type: "string" },
                        observacoes: { type: "string" }
                    }
                }
            }
        },
        async (request, reply) => {
            const d = request.body;

            const result = await pool.query(
                `
                INSERT INTO dores (
                    entrevista_id, categoria_id, titulo, descricao,
                    frequencia, impacto, solucao_atual, observacoes
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
                `,
                [
                    d.entrevista_id,
                    d.categoria_id,
                    d.titulo,
                    d.descricao,
                    d.frequencia ?? null,
                    d.impacto ?? null,
                    d.solucao_atual ?? null,
                    d.observacoes ?? null
                ]
            );

            return reply.code(201).send(result.rows[0]);
        }
    );
}
