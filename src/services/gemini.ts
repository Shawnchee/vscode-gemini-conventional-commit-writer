import * as vscode from 'vscode'
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiGeneratorService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    setApiKey(apiKey: string) {
        const config = vscode.workspace.getConfiguration('geminiCommitWriter');
        const modelName = config.get<string>('model', 'gemini-2.0-flash-exp');
        const temperature = config.get<number>('temperature', 0.3);
        const maxOutputTokens = config.get<number>('maxOutputTokens', 100);

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: maxOutputTokens,
            }
        });
    }

    async generateCommitMessage(diff: string): Promise<string> {
        if (!this.model) {
            throw new Error('Generative AI service not initialized. Please set the API key.');
        }

        const config = vscode.workspace.getConfiguration('geminiCommitWriter');
        const maxDiffLength = config.get<number>('maxDiffLength', 8000);
        
        const truncatedDiff = diff.length > maxDiffLength 
            ? diff.substring(0, maxDiffLength) + '\n... (truncated)' 
            : diff;

        const prompt = 
            `Generate a conventional commit message for the following git diff.
            Use the format: <type>(<scope>): <description>

            Your response must contain ONLY the commit message text, with no preamble, explanation, or markdown formatting (e.g., no code block)

            Conventional Commit Rules:
            - Single line only
            - Lowercase description
            - No period at end
            - Be specific based on the changes
            Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

            ### Git Diff:
            ---
            ${truncatedDiff}
            ---

            Make sure the commit message is solely based on the Git Diff changes only.
            `;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}