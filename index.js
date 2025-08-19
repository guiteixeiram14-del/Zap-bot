import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const INSTANCE_ID = "3E5EB67EEE35A0C5B10B7A1A2DC5201F";
const TOKEN = "9876D28DF11799E73AE36B2D";

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.event === "MESSAGE") {
    const msg = body.data.message;
    const chatId = body.data.chatId;   // grupo ou privado
    const mentions = body.data.mentions; // array de menções
    const isGroup = chatId.includes("@g.us");

    try {
      if (isGroup) {
        // Só responde se for marcado com @ no grupo
        if (mentions && mentions.includes(body.data.instance.phone)) {
          await axios.post(
            `https://api.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`,
            {
              phone: chatId,
              message: `Oi 👋 fui marcado e recebi: "${msg}"`
            }
          );
        }
      }
      // Se for privado → não faz nada
    } catch (err) {
      console.error("Erro ao responder:", err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(10000, () => {
  console.log("Bot rodando na porta 10000 🚀");
});
