import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Form } from "../models/Form";
import { nanoid } from "nanoid";
import { generateEmbedding, generateFormSchema } from "../services/geminiService";
import { retrieveRelevantFormsLocal } from "../services/localMemoryService";
import { Request, Response } from "express";


const router = Router();


router.post(
    "/generate",
    [body("prompt").notEmpty().withMessage("Prompt is required")],
    async (req: Request & { user?: any }, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


        try {
            const userId = req.user.id;
            const { prompt, title } = req.body;


            const relevantForms = await retrieveRelevantFormsLocal(userId, prompt, 5);
            const formSchema = await generateFormSchema(prompt, relevantForms);
            const embedding = await generateEmbedding(prompt);


            const shareableId = nanoid(10);


            const newForm = new Form({
                userId,
                title,
                prompt,
                formSchema,
                shareableId,
                metadata: {},
                embedding,
            });


            await newForm.save();
            res.json({ message: "Form generated", form: newForm });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);


router.get("/forms", async (req: any, res) => {
    try {
        const forms = await Form.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ forms });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch forms" });
    }
});


export default router;

