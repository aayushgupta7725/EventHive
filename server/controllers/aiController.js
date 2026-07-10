const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../config/db');

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Gaming', 'Health', 'Education', 'Social', 'Other'];

// POST /api/ai/suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({ message: 'AI service is not configured. Add GEMINI_API_KEY to server .env.' });
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
      `SELECT id, title, description, category, location, start_date
       FROM events
       WHERE in_trash = FALSE AND visibility = 'public' AND start_date > NOW()
       ORDER BY start_date ASC
       LIMIT 20`
    );
    const events = eventsResult.rows;

    const bio = user.bio?.trim() || '';
    const userName = user.name?.split(' ')[0] || 'there';

    // Build a concise prompt
    const prompt = `
You are an event recommendation engine for EventHive, an event management platform.

User profile:
- Name: ${userName}
- Bio: ${bio || 'No bio provided. Make general suggestions based on popular interests.'}

Available event categories on the platform: ${CATEGORIES.join(', ')}.

${events.length > 0 ? `Upcoming events on the platform:
${events.map(e => `- [${e.category}] "${e.title}" on ${new Date(e.start_date).toDateString()}${e.location ? ` at ${e.location}` : ''}`).join('\n')}` : 'No upcoming events yet.'}

Task: Based on the user's bio and interests, return EXACTLY a JSON object (no markdown, no explanation) in this format:
{
  "greeting": "A short personalized greeting (1 sentence, use their first name)",
  "suggestions": [
    {
      "category": "one of the category names above",
      "reason": "one sentence explaining why this fits the user",
      "emoji": "a single relevant emoji"
    }
  ],
  "tip": "one short motivational tip about discovering or hosting events (max 15 words)"
}

Rules:
- Return 3 suggestions.
- Each reason must reference something specific from the bio (or general interest if no bio).
- Only use category names from the provided list.
- Return only valid JSON, no markdown code blocks.
`.trim();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if model wraps output anyway
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('Gemini response was not valid JSON:', text);
      return res.status(502).json({ message: 'AI returned an unexpected response. Please try again.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('AI suggestion error:', err.message);
    // Distinguish quota/auth errors from real server errors
    if (err.message?.includes('API_KEY') || err.message?.includes('401')) {
      return res.status(401).json({ message: 'Invalid Gemini API key.' });
    }
    if (err.message?.includes('quota') || err.message?.includes('429')) {
      return res.status(429).json({ message: 'AI quota exceeded. Try again later.' });
    }
    res.status(500).json({ message: 'AI service error. Please try again.' });
  }
};
