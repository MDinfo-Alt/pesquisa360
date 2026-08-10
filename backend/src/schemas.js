// Sem isso, um id não numérico na URL vira erro de SQL (500) em vez de 400.
export const idParam = (nome = "id") => ({
    type: "object",
    required: [nome],
    properties: { [nome]: { type: "integer" } }
});
