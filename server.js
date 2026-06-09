const express = require('express');
const path = require('path');
const { createAppointment } = require('./lib/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/appointments', async (req, res) => {
  try {
    const result = await createAppointment(req.body);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    return res.status(500).json({ error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });
}

module.exports = app;
