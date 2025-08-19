import fetch from "node-fetch";
import express from "express";

const app = express();
app.use(express.json());

// CONFIGURAÇÕES 🔑
const ZAPI_URL = "https://api.z-api.io/instances/3E5EB67EEE35A0C5B10B7A1A2DC5201F/token/9876D28DF11799E73AE36B2D/send-message";
const OPENAI_API_KEY = "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"; // coloque sua chave OpenAI aqui!

// Função para enviar mensagem no WhatsApp via Z-API
async function enviarMensagem(numero, mensagem) {
  await fetch(ZAPI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: numero,
      message: mensagem,
    }),
  });
}

// Função para gerar resposta com IA
async function gerarRespostaIA(pergunta) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente divertido que responde mensagens do WhatsApp." },
        { role: "user", content: pergunta }
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Não entendi sua pergunta 🤔";
}

// Rota de webhook para receber mensagens
app.post("/webhook", async (req, res) => {
  const data = req.body;

  if (!data || !data.message || !data.message.text) {
    return res.sendStatus(200);
  }

  const mensagem = data.message.text.toLowerCase();
  const remetente = data.message.from;

  // Só responde se tiver @guilherme
  if (mensagem.includes("@guilherme")) {
    const respostaIA = await gerarRespostaIA(mensagem);
    await enviarMensagem(remetente, respostaIA);
  }

  res.sendStatus(200);
});

// Servidor rodando
app.listen(3000, () => {
  console.log("🤖 Bot com IA rodando na porta 3000");
});
