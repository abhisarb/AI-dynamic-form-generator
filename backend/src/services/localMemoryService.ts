import { Form } from "../models/Form";
import { generateEmbedding } from "./geminiService";


function cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}


export async function retrieveRelevantFormsLocal(userId: string, prompt: string, topK = 5) {
    const promptEmbedding = await generateEmbedding(prompt);
    const forms = await Form.find({ userId });


    const scored = forms.map((form) => ({
        form,
        score: form.embedding?.length ? cosineSimilarity(promptEmbedding, form.embedding) : 0,
    }));


    scored.sort((a, b) => b.score - a.score);


    return scored.slice(0, topK).map((x) => ({
        _id: x.form._id,
        title: x.form.title,
        metadata: x.form.metadata || {},
        score: x.score,
    }));
}