import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// =========================
// CONFIGURAÇÕES 🔑
// =========================
const WHATSAPP_ID = process.env.WHATSAPP_ID; // ID da instância Z-API
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // Token da instância Z-API
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Chave da OpenAI

const ZAPI_URL = `https://api.z-api.io/instances/${WHATSAPP_ID}/token/${WHATSAPP_TOKEN}/send-message`;

// =========================
// Função para enviar mensagem no WhatsApp via Z-API
// =========================
async function sendMessage(phone, message) {
  try {
    await fetch(ZAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message }),
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

// =========================
// Função para chamar GPT na OpenAI
// =========================
async function askGPT(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Não entendi sua pergunta.";
  } catch (error) {
    console.error("Erro na API OpenAI:", error);
    return "Erro ao conectar com a inteligência artificial.";
  }
}

// =========================
// Rota Webhook do Z-API
// =========================
app.post("/webhook", async (req, res) => {
  const { phone, message } = req.body;

  if (message) {
    console.log(`Mensagem recebida de ${phone}: ${message}`);
    const resposta = await askGPT(message);
    await sendMessage(phone, resposta);
  }

  res.sendStatus(200);
});

// =========================
// Inicializar servidor
// =========================
app.listen(3000, () => {
  console.log("🤖 Bot rodando na porta 3000");
});
