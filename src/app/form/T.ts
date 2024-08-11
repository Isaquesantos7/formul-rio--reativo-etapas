export const dataForm = {
  identificacao: {
    nome: "Nome da Mantenedora Exemplo",
    codigoRegiao: "12345"
  },
  endereco: {
    rua: "Rua Exemplo",
    cidade: "Cidade Exemplo",
    estado: "Estado Exemplo",
    cep: "12345-678"
  },
  conta: [
    {
      agencia: "1234",
      numero: "56789-0",
      tipoConta: "Corrente",
      nomeBanco: "Banco Exemplo",
      transacoes: [
        {
          valor: "71",
          data: "987308769"
        },
        {
          valor: "86",
          data: "950505050"
        }
      ]
    }
  ],
  telefone: [
    {
      ddd: "11",
      numeroTelefone: "987654321"
    },
    {
      ddd: "21",
      numeroTelefone: "123456789"
    }
  ]
};