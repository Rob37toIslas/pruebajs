import express from "express";

const app = express();
const VERIFY_TOKEN = "MiTokenDeVerificacion123!";

// Ruta para la verificación
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado correctamente");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // token inválido
    }
  }
});

// Ruta para recibir mensajes
app.post("/webhook", (req, res) => {
  console.log("Mensaje recibido:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
