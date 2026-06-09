const form = document.getElementById('appointment-form');
const submitBtn = document.getElementById('submit-btn');
const messageEl = document.getElementById('form-message');
const dateInput = document.getElementById('date');

function setMinDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  dateInput.min = now.toISOString().slice(0, 16);
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `form-message visible ${type}`;
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'form-message';
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.classList.toggle('loading', loading);
}

async function handleSubmit(e) {
  e.preventDefault();
  clearMessage();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const date = form.date.value;

  if (!name || !email || !date) {
    showMessage('Bitte füllen Sie alle Felder aus.', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, date }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Ein Fehler ist aufgetreten.', 'error');
      return;
    }

    showMessage(data.message, 'success');
    form.reset();
    setMinDate();
  } catch {
    showMessage('Verbindungsfehler. Bitte versuchen Sie es erneut.', 'error');
  } finally {
    setLoading(false);
  }
}

setMinDate();
form.addEventListener('submit', handleSubmit);
