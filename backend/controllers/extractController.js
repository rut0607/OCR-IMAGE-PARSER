const { GoogleGenerativeAI } = require('@google/generative-ai');

const extractData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType    = req.file.mimetype;

    const prompt = `You are a strict JSON API.
Extract all table data from this handwritten image.
RETURN ONLY RAW JSON. No explanation. No markdown. No backticks.

FORMAT:
{
  "date": "string or null",
  "rows": [
    {
      "no": "string",
      "job": "string or null",
      "sn_no": "string or null",
      "actual_weight": "string or null",
      "after_core_weight": "string or null",
      "core_scrap": "string or null",
      "x_and_y": "string or null"
    }
  ]
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data    : imageBase64
        }
      }
    ]);

    const text = result.response.text().trim();

    // Strip markdown backticks if Gemini adds them
    const clean = text
      .replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error('Extract error:', err);
    res.status(500).json({ error: 'Failed to extract data: ' + err.message });
  }
};

module.exports = { extractData };