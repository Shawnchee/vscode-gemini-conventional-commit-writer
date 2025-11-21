import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiGeneratorService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    setApiKey(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 100,
            }
        })
    }

    async generateCommitMessage(diff: string): Promise<string> {
        if (!this.model) {
            throw new Error('Generative AI service not initialized. Please set the API key.');
        }

        const truncatedDiff = diff.length > 8000 ? diff.substring(0,8000) : diff

        const prompt = 
            `
            Generate a conventional commit message for the following git diff.
            Use the format: <type>(<scope>): <description>

            Your response must contain ONLY the commit message text, with no preamble, explanation, or markdown formatting (e.g., no code block)

            Conventional Commit Rules:
            Rules:
            - Single line only
            - Lowercase description
            - No period at end
            - Be specific based on the changes
            Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

            ### Git Diff:
            ---
            ${truncatedDiff}
            ---\

            Make sure the commit message is solely based on the Git Diff changes only.
            `;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}