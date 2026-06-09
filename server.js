const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/appointments', async (req, res) => {
  const { name, email, date } = req.body;

  if (!name?.trim() || !email?.trim() || !date) {
    return res.status(400).json({ error: 'Bitte füllen Sie alle Felder aus.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
  }

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const appointments = JSON.parse(raw);

    const entry = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      date,
      createdAt: new Date().toISOString(),
    };

    appointments.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(appointments, null, 2), 'utf-8');

    res.status(201).json({ success: true, message: 'Ihr Terminwunsch wurde erfolgreich übermittelt.' });
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).json({ error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
