const express = require('express');
const fetch = require('node-fetch'); // Asegúrate de instalar: npm install node-fetch

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = 3000;
const verifyToken = "MiTokenDeVerificacion123!";

// ⭐ NUEVO: URL de tu webhook de n8n
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/cf49bc13-5575-410d-b126-0e9f2cce6084'; // Reemplaza con tu URL real de n8n

// Route for GET requests (verificación del webhook)
app.get('/', (req, res) => {
  console.log('Query recibido:', req.query);
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// ⭐ MODIFICADO: Route for POST requests - Ahora reenvía a n8n
app.post('/', async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log('Datos recibidos de WhatsApp:', JSON.stringify(req.body, null, 2));
  
  try {
    // Reenviar los datos al webhook de n8n
    console.log('Reenviando a n8n...');
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    if (response.ok) {
      console.log('✅ Datos enviados correctamente a n8n');
      console.log('Status n8n:', response.status);
    } else {
      console.error('❌ Error al enviar a n8n:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión con n8n:', error.message);
  }
  
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
  console.log(`Webhook listo para recibir mensajes y reenviar a n8n: ${N8N_WEBHOOK_URL}`);
});
