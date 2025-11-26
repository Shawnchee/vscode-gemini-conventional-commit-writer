import * as vscode from 'vscode'

export class GeminiGeneratorService {
    private genAI: any = null;

    async setApiKey(apiKey: string) {
        const { GoogleGenAI } = await import("@google/genai");
        this.genAI = new GoogleGenAI({ apiKey: apiKey });
    }

    async generateCommitMessage(diff: string, detailed: boolean = false): Promise<string> {
        if (!this.genAI) {
            throw new Error('Generative AI service not initialized. Please set the API key.');
        }

        const config = vscode.workspace.getConfiguration('geminiCommitWriter');
        const modelName = config.get<string>('model', 'gemini-2.5-flash');
        const temperature = config.get<number>('temperature', 0.1);
        const maxOutputTokens = config.get<number>('maxOutputTokens', detailed ? 1000 : 300);
        const maxDiffLength = config.get<number>('maxDiffLength', 8000);
        
        const truncatedDiff = diff.length > maxDiffLength 
            ? diff.substring(0, maxDiffLength) + '\n... (truncated)' 
            : diff;

        const prompt = detailed ? this.getDetailedPrompt(truncatedDiff) : this.getBriefPrompt(truncatedDiff);
            
        try {
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

    private getBriefPrompt(diff: string): string {
        return `Generate a conventional commit message for this git diff.

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
            ${diff}
            ---

            Generate ONLY the commit message, nothing else.
            `;
    }

    private getDetailedPrompt(diff: string): string {
        return `Generate a detailed conventional commit message for this git diff.

REQUIRED FORMAT:
<type>(<scope>): <subject>

<body>

<footer>

RULES:
- Subject: Single line, lowercase, no period (max 50 chars)
- Body: Explain WHAT and WHY (wrap at 72 chars)
- Footer: Breaking changes or issue references

TYPES:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code formatting
- refactor: Code restructuring
- perf: Performance improvement
- test: Tests
- build: Build system
- ci: CI/CD
- chore: Maintenance

BODY GUIDELINES:
- Explain what changed and why
- Use bullet points for multiple changes
- Focus on motivation and context

FOOTER (if applicable):
- BREAKING CHANGE: describe breaking changes
- Fixes #123: reference issues
- Refs: #456: related issues
EXAMPLE:
feat(auth): add oauth2 google integration

- Implement OAuth2 flow with Google provider
- Add user profile fetching and caching
- Create callback handler for authentication

This enables users to sign in with their Google accounts,
improving onboarding experience and reducing friction.

Refs: #234

GIT DIFF:
---
${diff}
---

Generate the complete commit message with subject, body, and footer (if applicable).`;

    }
}

