import { createClient } from '@supabase/supabase-js'
import './styles.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="page-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">Guest Feedback Portal</p>
        <h1>Guestlytics</h1>
        <p class="subtitle">Collect guest feedback, understand service quality, and improve every visit.</p>
      </div>
      <div class="hero-card">
        <span class="score">4.8</span>
        <span>Average satisfaction target</span>
      </div>
    </section>

    <section class="content-grid">
      <form id="feedbackForm" class="panel form-panel">
        <h2>Share your feedback</h2>

        <label>
          Guest Name
          <input id="guestName" type="text" placeholder="Enter your name" required />
        </label>

        <label>
          Email
          <input id="email" type="email" placeholder="name@example.com" required />
        </label>

        <label>
          Rating
          <select id="rating" required>
            <option value="">Select rating</option>
            <option value="5">Excellent - 5</option>
            <option value="4">Good - 4</option>
            <option value="3">Average - 3</option>
            <option value="2">Poor - 2</option>
            <option value="1">Very Poor - 1</option>
          </select>
        </label>

        <label>
          Comments
          <textarea id="comments" placeholder="Tell us about your experience" required></textarea>
        </label>

        <button type="submit">Submit Feedback</button>
        <p id="message" class="message"></p>
      </form>

      <aside class="panel insights-panel">
        <h2>Feedback Insights</h2>

        <div class="stats">
          <div>
            <strong id="totalCount">0</strong>
            <span>Total feedback</span>
          </div>
          <div>
            <strong id="avgRating">0.0</strong>
            <span>Average rating</span>
          </div>
        </div>

        <h3>Recent responses</h3>
        <div id="feedbackList" class="feedback-list"></div>
      </aside>
    </section>
  </main>
`

const form = document.querySelector('#feedbackForm')
const message = document.querySelector('#message')
const feedbackList = document.querySelector('#feedbackList')
const totalCount = document.querySelector('#totalCount')
const avgRating = document.querySelector('#avgRating')

function setMessage(text, type = '') {
  message.textContent = text
  message.className = `message ${type}`
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function loadFeedback() {
  if (!supabase) {
    feedbackList.innerHTML =
      '<p class="empty">Add your Supabase URL and anon key in .env to enable backend.</p>'
    return
  }

  const { data, error } = await supabase
    .from('guestlytics_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    feedbackList.innerHTML = `<p class="empty">${error.message}</p>`
    return
  }

  const items = data || []

  totalCount.textContent = items.length

  const average = items.length
    ? items.reduce((sum, item) => sum + Number(item.rating), 0) / items.length
    : 0

  avgRating.textContent = average.toFixed(1)

  feedbackList.innerHTML = items.length
    ? items
        .map(
          item => `
            <article class="feedback-item">
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <span>${'★'.repeat(Number(item.rating))}</span>
              </div>
              <p>${escapeHtml(item.message)}</p>
            </article>
          `
        )
        .join('')
    : '<p class="empty">No feedback yet. Submit the first response.</p>'
}

form.addEventListener('submit', async event => {
  event.preventDefault()

  if (!supabase) {
    setMessage('Supabase is not configured. Add your keys in .env first.', 'error')
    return
  }

  const payload = {
  name: document.querySelector('#guestName').value.trim(),
  email: document.querySelector('#email').value.trim(),
  rating: Number(document.querySelector('#rating').value),
  message: document.querySelector('#comments').value.trim()
}
console.log("PAYLOAD:", payload)
  const { error } = await supabase
  .from('guestlytics_feedback')
  .insert([payload])

  if (error) {
    setMessage(error.message, 'error')
    return
  }

  form.reset()
  setMessage('Thank you. Your feedback was submitted successfully.', 'success')
  loadFeedback()
})

loadFeedback()