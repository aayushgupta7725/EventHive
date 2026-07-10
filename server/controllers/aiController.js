const Groq = require('groq-sdk');
const pool = require('../config/db');

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Gaming', 'Health', 'Education', 'Social', 'Other'];

// POST /api/ai/suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: 'AI service is not configured. Add GROQ_API_KEY to server .env.' });
    }

    // Fetch user profile for bio
    const userResult = await pool.query(
      'SELECT name, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch upcoming public events from DB
    const eventsResult = await pool.query(
      `SELECT title, category, location, start_date
       FROM events
       WHERE in_trash = FALSE AND visibility = 'public' AND start_date > NOW()
       ORDER BY start_date ASC
       LIMIT 20`
    );
    const events = eventsResult.rows;

    const bio = user.bio?.trim() || '';
    const userName = user.name?.split(' ')[0] || 'there';

    const prompt = `You are an event recommendation engine for EventHive.

User: ${userName}
Bio: ${bio || 'No bio provided — use general popular interests.'}

Available categories: ${CATEGORIES.join(', ')}

${events.length > 0
  ? `Upcoming events:\n${events.map(e => `- [${e.category}] "${e.title}"${e.location ? ` at ${e.location}` : ''}`).join('\n')}`
  : 'No upcoming events yet.'}

Return ONLY a valid JSON object — no markdown, no explanation:
{
  "greeting": "short personalized greeting using their first name (1 sentence)",
  "suggestions": [
    { "category": "<one from the list>", "reason": "<one sentence why it fits the user>", "emoji": "<single emoji>" },
    { "category": "<one from the list>", "reason": "<one sentence why it fits the user>", "emoji": "<single emoji>" },
    { "category": "<one from the list>", "reason": "<one sentence why it fits the user>", "emoji": "<single emoji>" }
  ],
  "tip": "one short motivational tip about events (max 12 words)"
}`;

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful event recommendation assistant. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return res.status(502).json({ message: 'AI returned an empty response. Please try again.' });

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error('Groq response was not valid JSON:', text);
      return res.status(502).json({ message: 'AI returned an unexpected response. Please try again.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('AI suggestion error:', err.message);
    if (err.status === 401 || err.message?.includes('401') || err.message?.includes('API key')) {
      return res.status(401).json({ message: 'Invalid Groq API key.' });
    }
    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('rate limit')) {
      return res.status(429).json({ message: 'AI rate limit reached. Try again in a moment.' });
    }
    res.status(500).json({ message: 'AI service error. Please try again.' });
  }
};
