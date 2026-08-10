import pool from "../db/connection.js";
import { idParam } from "../schemas.js";

const STATUS = ["IDEIA", "EM_ANALISE", "PREPARADA", "APRESENTADA", "DESCARTADA"];

export default async function solucoesRoutes(app) {

    app.get("/solucoes", async () => {
        const result = await pool.query(`
            SELECT
                s.*,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT('id', d.id, 'titulo', d.titulo)
                        ORDER BY d.id
                    ) FILTER (WHERE d.id IS NOT NULL),
                    '[]'
                ) AS dores
            FROM solucoes s
            LEFT JOIN dores_solucoes ds ON ds.solucao_id = s.id
            LEFT JOIN dores d ON d.id = ds.dor_id
            GROUP BY s.id
            ORDER BY s.id DESC
        `);

        return result.rows;
    });

    app.post(
        "/solucoes",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["nome", "descricao", "dores"],
                    properties: {
                        nome: { type: "string", minLength: 1, maxLength: 150 },
                        descricao: { type: "string", minLength: 1 },
                        funcionamento_proposto: { type: "string" },
                        beneficio_esperado: { type: "string" },
                        complexidade: { type: "string", enum: ["BAIXA", "MEDIA", "ALTA"] },
                        observacoes: { type: "string" },
                        // RN03: no mínimo uma dor relacionada.
                        dores: {
                            type: "array",
                            minItems: 1,
                            items: { type: "integer" }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            const s = request.body;
            const client = await pool.connect();

            try {
                await client.query("BEGIN");

                const solucao = await client.query(
                    `
                    INSERT INTO solucoes (
                        nome, descricao, funcionamento_proposto,
                        beneficio_esperado, complexidade, observacoes
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                    `,
                    [
                        s.nome,
                        s.descricao,
                        s.funcionamento_proposto ?? null,
                        s.beneficio_esperado ?? null,
                        s.complexidade ?? null,
                        s.observacoes ?? null
                    ]
                );

                for (const dorId of s.dores) {
                    await client.query(
                        "INSERT INTO dores_solucoes (dor_id, solucao_id) VALUES ($1, $2)",
                        [dorId, solucao.rows[0].id]
                    );
                }

                await client.query("COMMIT");

                return reply.code(201).send(solucao.rows[0]);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        }
    );

    // RN08: o status evolui conforme a solução avança.
    app.patch(
        "/solucoes/:id",
        {
            schema: {
                params: idParam(),
                body: {
                    type: "object",
                    required: ["status"],
                    properties: { status: { type: "string", enum: STATUS } }
                }
            }
        },
        async (request, reply) => {
            const result = await pool.query(
                "UPDATE solucoes SET status = $2 WHERE id = $1 RETURNING *",
                [request.params.id, request.body.status]
            );

            if (result.rows.length === 0) {
                return reply.code(404).send({ message: "Solução não encontrada" });
            }

            return result.rows[0];
        }
    );
}
