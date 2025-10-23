import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simulando um "banco de dados" em memória
const consultas = [];

app.post("/consultas", (req, res) => {
  const { nome, rg, email, medico, data } = req.body;

  // Validação 1: RG já cadastrado
  const rgExistente = consultas.find((c) => c.rg === rg);
  if (rgExistente) {
    return res.status(400).json({
      erro: "Este RG já está cadastrado. Verifique se já possui uma consulta marcada.",
    });
  }

  // Validação 2: Mesmo RG e médico
  const consultaMesmoMedico = consultas.find(
    (c) => c.rg === rg && c.medico === medico
  );
  if (consultaMesmoMedico) {
    return res.status(400).json({
      erro: "Esta pessoa já tem uma consulta marcada com este médico.",
    });
  }

  // Validação 3: Data já ocupada (simplesmente impedindo duas consultas na mesma data)
  const dataOcupada = consultas.find((c) => c.data === data);
  if (dataOcupada) {
    return res.status(400).json({
      erro: "Esta data já está ocupada. Escolha outra data para agendamento.",
    });
  }

  // Se passou nas validações, cadastrar
  const novaConsulta = { nome, rg, email, medico, data };
  consultas.push(novaConsulta);

  res.status(201).json({
    mensagem: "Consulta agendada com sucesso!",
    consulta: novaConsulta,
  });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
