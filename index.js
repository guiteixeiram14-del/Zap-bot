import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const INSTANCE_ID = "3E5EB67EEE35A0C5B10B7A1A2DC5201F";
const TOKEN = "9876D28DF11799E73AE36B2D";

app.post("/webhook", async (req, res) => {
  const message = req.body?.data?.message;

  if (message?.text?.message) {
    const text = message.text.message;
    const from = message.key.remoteJid;

    console.log("Mensagem recebida:", text);

    // Resposta automática
    await axios.post(`https://api.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`, {
      phone: from.replace("@s.whatsapp.net", ""),
      message: `Você disse: ${text}`
    });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Bot rodando na porta ${PORT}`));
