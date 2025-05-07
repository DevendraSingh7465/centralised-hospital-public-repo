require('dotenv').config({ path: '../.env' });

const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function chat(question) {
    const limits = " Answer this question in under 20 words.";
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: question + limits,
    });
    const answer = response.text;
    console.log("Gemini Controller Question:", question + limits);
    console.log("Gemini Controller Response:", answer);
    return answer;
}

module.exports = {
    chat,
}