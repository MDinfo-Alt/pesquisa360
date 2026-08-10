import pool from "../db/connection.js";

// Listas de apoio: segmentos, categorias e as perguntas da pesquisa.
export default async function catalogosRoutes(app) {

    for (const tabela of ["segmentos", "categorias_dores", "categorias_perguntas"]) {
        app.get(`/${tabela}`, async () => {
            const result = await pool.query(
                `SELECT * FROM ${tabela} WHERE ativo = TRUE ORDER BY nome`
            );

            return result.rows;
        });

        // RN03 (RF01) / RN05 (RF04): pode cadastrar um novo na hora.
        app.post(
            `/${tabela}`,
            {
                schema: {
                    body: {
                        type: "object",
                        required: ["nome"],
                        properties: {
                            nome: { type: "string", minLength: 1, maxLength: 100 }
                        }
                    }
                }
            },
            async (request, reply) => {
                const result = await pool.query(
                    `INSERT INTO ${tabela} (nome) VALUES ($1) RETURNING *`,
                    [request.body.nome]
                );

                return reply.code(201).send(result.rows[0]);
            }
        );
    }

    // Perguntas ativas na ordem configurada, com as opções de cada uma.
    app.get("/perguntas", async () => {
        const result = await pool.query(`
            SELECT
                p.id,
                p.texto,
                p.tipo_resposta,
                p.ordem,
                c.nome AS categoria,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT('id', o.id, 'texto', o.texto)
                        ORDER BY o.ordem
                    ) FILTER (WHERE o.id IS NOT NULL),
                    '[]'
                ) AS opcoes
            FROM perguntas p
            JOIN categorias_perguntas c ON c.id = p.categoria_id
            LEFT JOIN opcoes_perguntas o ON o.pergunta_id = p.id AND o.ativa = TRUE
            WHERE p.ativa = TRUE
            GROUP BY p.id, c.nome
            ORDER BY p.ordem
        `);

        return result.rows;
    });
}
