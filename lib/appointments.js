const fs = require('fs').promises;
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

function getDataFile() {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'appointments.json');
  }
  return SEED_FILE;
}

async function readAppointments() {
  const dataFile = getDataFile();

  try {
    const raw = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    try {
      const raw = await fs.readFile(SEED_FILE, 'utf-8');
      const data = JSON.parse(raw);
      await fs.writeFile(dataFile, raw, 'utf-8');
      return data;
    } catch {
      return [];
    }
  }
}

async function createAppointment({ name, email, date }) {
  if (!name?.trim() || !email?.trim() || !date) {
    return { error: 'Bitte füllen Sie alle Felder aus.', status: 400 };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', status: 400 };
  }

  const appointments = await readAppointments();

  const entry = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    date,
    createdAt: new Date().toISOString(),
  };

  appointments.push(entry);
  await fs.writeFile(getDataFile(), JSON.stringify(appointments, null, 2), 'utf-8');

  return {
    status: 201,
    data: {
      success: true,
      message: 'Ihr Terminwunsch wurde erfolgreich übermittelt.',
    },
  };
}

module.exports = { createAppointment };
