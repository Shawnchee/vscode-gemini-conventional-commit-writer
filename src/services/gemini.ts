import * as vscode from 'vscode'

export class GeminiGeneratorService {
    private genAI: any = null;

    async setApiKey(apiKey: string) {
        const { GoogleGenAI } = await import("@google/genai");
        this.genAI = new GoogleGenAI({ apiKey: apiKey });
    }

    async generateCommitMessage(diff: string): Promise<string> {
        if (!this.genAI) {
            throw new Error('Generative AI service not initialized. Please set the API key.');
        }

        const config = vscode.workspace.getConfiguration('geminiCommitWriter');
        const modelName = config.get<string>('model', 'gemini-2.5-flash');
        const temperature = config.get<number>('temperature', 0.1);
        const maxOutputTokens = config.get<number>('maxOutputTokens', 100);
        const maxDiffLength = config.get<number>('maxDiffLength', 8000);
        
        const truncatedDiff = diff.length > maxDiffLength 
            ? diff.substring(0, maxDiffLength) + '\n... (truncated)' 
            : diff;

        const prompt = 
            `Generate a conventional commit message for the following git diff.
            Use the format: <type>(<scope>): <description>

            Your response must contain ONLY the commit message text, with no preamble, explanation, or markdown formatting (e.g., no code block)

            Conventional Commit Rules:
            - Single line only (Based on Max Output Tokens)
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

        try {
            // const model = this.genAI.getGenerativeModel({
            //     model: modelName,
            //     generationConfig: {
            //         temperature: temperature,
            //         maxOutputTokens: maxOutputTokens,
            //     }
            // });
            const result = await this.genAI.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    temperature: temperature,
                    maxOutputTokens: maxOutputTokens,  
                }
                
            });
            const response = await result.text;
            console.log("Model used:", modelName);
            console.log("AI Response:", response);
            if (!response) {
                throw new Error('Empty response from AI model');
            }
            return response;

        } catch (error: any) {
            // Handle rate limit errors
            if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
                throw new Error('⏱️ Rate limit exceeded. Please wait a few minutes and try again. Google\'s free tier has usage limits.');
            }

            // Generic error
            throw new Error(`❌ AI generation failed: ${error.message || 'Unknown error'}`);
        }
    }
}