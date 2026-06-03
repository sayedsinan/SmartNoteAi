require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

// Create Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Generate study material from notes
async function generateStudyMaterial(notes) {

    const prompt = `
You are an educational assistant.

Read the notes carefully.

Rules:
1. Generate questions ONLY from the information explicitly present in the notes.
2. Do NOT use external knowledge.
3. Create exactly 5 MCQs.
4. Each MCQ must have 4 options.
5. Include the correct answer.
6. Return ONLY valid JSON.
7. Do not include markdown, explanations, or extra text.

Output format:

{
  "topic": "Topic Name",
  "mcqs": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Correct Option"
    }
  ]
}

Notes:
${notes}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt
    });

    return Json.parse(response.text);
}

// Check whether Gemini API is working
async function checkGeminiService() {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Reply with: Gemini Service is Active"
    });

    return response.text;
}

module.exports = {
    generateStudyMaterial,
    checkGeminiService
};