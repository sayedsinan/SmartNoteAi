require('dotenv').config();


const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// GEMINI_API_KEY="AIzaSyDibXokauWWsTFJ5tsnUX9YnO7f3NUHtGY";

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

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
        model: "gemini-3.1-flash-lite",
        contents: prompt
    });
    console.log("RESULT:", response);
console.log("TYPE:", typeof response);
    return response.text;
};

const checkGeminiService = async () => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello, this is a health check. Please reply with exactly 'Gemini Service is Active'"
    });
    return response.text; 
};

module.exports = {
    generateStudyMaterial,
    checkGeminiService
};