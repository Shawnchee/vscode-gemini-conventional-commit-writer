import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiGeneratorService {
    private genAI: GoogleGenerativeAI | null = null;

    setApiKey(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateCommitMessage(diff: string): Promise<string> {
        if (!this.genAI) {
            throw new Error('Generative AI service not initialized. Please set the API key.');
        }

        const model = this.genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

        const prompt = 
            `
            Generate a conventional commit message for the following git diff.
            Use the format: <type>(<scope>): <description>

            Your response must contain ONLY the commit message text, with no preamble, explanation, or markdown formatting (e.g., no code block)

            Conventional Commit Rules:

            1.  **Format:** The message must be structured as \`<type>[optional scope]: <description>\`
            2.  **Types:** Use one of the following official types. Do not use any others:
                * \`feat\`: A new feature is introduced.
                * \`fix\`: A bug fix is implemented.
                * \`docs\`: Documentation changes.
                * \`style\`: Changes that do not affect the meaning of the code (whitespace, formatting, missing semicolons, etc.).
                * \`refactor\`: A code change that neither fixes a bug nor adds a feature.
                * \`perf\`: A code change that improves performance.
                * \`test\`: Adding missing tests or correcting existing tests.
                * \`build\`: Changes that affect the build system or external dependencies (e.g., gulp, npm).
                * \`ci\`: Changes to CI configuration files and scripts (e.g., GitHub Actions, Jenkins).
                * \`chore\`: Other changes that don't modify source or test files.
            3.  **Description:** The description must be a **brief, single-line summary** of the change.
                * Start the description with a **lowercase letter**.
                * Do **not** end the description with a period.
            4.  **Breaking Changes (Optional):** If the change is API-breaking, append an exclamation mark (\`!\`) after the type/scope (e.g., \`feat!: breaking new feature\`). This is often followed by a separate paragraph in the body starting with \`BREAKING CHANGE:\`, but for a single-line message, focus only on the required header.
            5.  **Scope (Optional):** The scope is a parenthesized word describing the section of the codebase being changed (e.g., \`(parser)\`, \`(core)\`). Omit the parentheses and the scope entirely if the change is general.

            ### Git Diff:

            ---
            ${diff}
            ---
            `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}