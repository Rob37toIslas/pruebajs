// Import Express.js y axios
const express = require('express');
const axios = require('axios'); // Instalar: npm install axios

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = 3000;
const verifyToken = "MiTokenDeVerificacion123!";

// ⭐ URL de tu webhook de n8n
const N8N_WEBHOOK_URL = 'https://5678-rob37toislas-pruebajs-45gc7naqt4p.ws-us121.gitpod.io/webhook-test/14ca0bf8-7310-444a-af9b-b037e8816801';

// Route for GET requests
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

// Route for POST requests
app.post('/', async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log('Datos recibidos de WhatsApp:', JSON.stringify(req.body, null, 2));
  
  try {
    // Reenviar los datos al webhook de n8n usando axios
    console.log('Reenviando a n8n...');
    
    const response = await axios.post(N8N_WEBHOOK_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Datos enviados correctamente a n8n');
    console.log('Status n8n:', response.status);
    
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
