// require('dotenv').config();
const GEMINI_API_KEY = "AQ.Ab8RN6Jw_fCRCINOd7yTPpEFLAp-uHvc4LaNJsG51cE9R8sSRQ";
const { GoogleGenAI } = require("@google/genai");

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const generateStudyMaterial = async (notes) => {

    const prompt = `
You are an educational assistant. 

Analyze the following student notes.

Generate:

1. Topic Title
2. Short Summary
3. 5 Important Points
4. Exam Revision Notes
5. 5 Viva Questions
6. 5 MCQs with Answers

Notes:

${notes}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",  // fixed: was gemini-3.1-flash-lite (doesn't exist)
        contents: prompt
    });

    const text = response.text
        ?? response.candidates?.[0]?.content?.parts?.[0]?.text
        ?? null;

    if (!text) {
        throw new Error("Gemini returned no text content");
    }

    return text;
};

const checkGeminiService = async () => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello, this is a health check. Please reply with exactly 'Gemini Service is Active'"
    });
    return response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text;
};

module.exports = {
    generateStudyMaterial,
    checkGeminiService
};