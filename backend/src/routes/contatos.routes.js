import pool from "../db/connection.js";
import { idParam } from "../schemas.js";

const campos = {
    nome: { type: "string", minLength: 1, maxLength: 150 },
    cargo: { type: "string", maxLength: 100 },
    telefone_whatsapp: { type: "string", maxLength: 30 },
    email: { type: "string", maxLength: 150 },
    observacoes: { type: "string" }
};

export default async function contatosRoutes(app) {

    app.get("/empresas/:empresaId/contatos", { schema: { params: idParam("empresaId") } }, async (request) => {
        const result = await pool.query(
            "SELECT * FROM contatos WHERE empresa_id = $1 ORDER BY nome",
            [request.params.empresaId]
        );

        return result.rows;
    });

    app.post(
        "/empresas/:empresaId/contatos",
        {
            schema: {
                params: idParam("empresaId"),
                body: {
                    type: "object",
                    required: ["nome"],
                    properties: campos
                }
            }
        },
        async (request, reply) => {
            const { nome, cargo, telefone_whatsapp, email, observacoes } = request.body;

            const result = await pool.query(
                `
                INSERT INTO contatos (empresa_id, nome, cargo, telefone_whatsapp, email, observacoes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                `,
                [
                    request.params.empresaId,
                    nome,
                    cargo ?? null,
                    telefone_whatsapp ?? null,
                    email ?? null,
                    observacoes ?? null
                ]
            );

            return reply.code(201).send(result.rows[0]);
        }
    );

    // RN06: contato pode ser atualizado depois.
    app.patch(
        "/contatos/:id",
        {
            schema: {
                params: idParam(),
                body: {
                    type: "object",
                    minProperties: 1,
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

            const set = entradas.map(([campo], i) => `${campo} = $${i + 2}`).join(", ");

            const result = await pool.query(
                `UPDATE contatos SET ${set} WHERE id = $1 RETURNING *`,
                [request.params.id, ...entradas.map(([, valor]) => valor)]
            );

            if (result.rows.length === 0) {
                return reply.code(404).send({ message: "Contato não encontrado" });
            }

            return result.rows[0];
        }
    );
}
