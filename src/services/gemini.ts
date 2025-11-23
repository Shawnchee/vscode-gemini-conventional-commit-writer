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
        const maxOutputTokens = config.get<number>('maxOutputTokens', 300);
        const maxDiffLength = config.get<number>('maxDiffLength', 8000);
        
        const truncatedDiff = diff.length > maxDiffLength 
            ? diff.substring(0, maxDiffLength) + '\n... (truncated)' 
            : diff;

        const prompt = 
            `Generate a conventional commit message for this git diff.

            REQUIRED FORMAT: <type>(<scope>): <description>

            RULES:
            - Single line only, no body or footers
            - Lowercase description, no period at end
            - Be specific and concise based on actual changes

            TYPES:
            - feat: New feature
            - fix: Bug fix
            - docs: Documentation only
            - style: Code formatting (no logic change)
            - refactor: Code restructuring (no behavior change)
            - perf: Performance improvement
            - test: Add/update tests
            - build: Build system/dependencies
            - ci: CI/CD configuration
            - chore: Maintenance tasks

            SCOPE: Optional, describes affected area (e.g., api, auth, parser)
            GIT DIFF:
            ---
            ${truncatedDiff}
            ---

            Generate ONLY the commit message, nothing else.
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
                    thinkingConfig: {
                        thinkingBudget: 0,
                    }
                }
                
                
            });
            const response = await result.text;

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