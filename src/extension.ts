import * as vscode from 'vscode';
import { GitUtils } from './utils/git';
import { GeminiGeneratorService } from './services/gemini';

const API_KEY_SECRET = 'geminiApiKey';

export function activate(context: vscode.ExtensionContext) {
	const gitUtils = new GitUtils();
	const geminiService = new GeminiGeneratorService();

	// Set API Key command
	const setApiKey = vscode.commands.registerCommand('vscode-gemini-commit-writer.setApiKey', async () => {
		const apiKey = await vscode.window.showInputBox({
			prompt: 'Enter your Gemini API Key',
			password: true,
			ignoreFocusOut: true
		});

		if (apiKey) {
			await context.secrets.store(API_KEY_SECRET, apiKey);
			vscode.window.showInformationMessage('Gemini API Key saved successfully.');
		}
	});

	// Generate commit message command
	const generateCommitMessage = vscode.commands.registerCommand('vscode-gemini-commit-writer.generateCommitMessage', async () => {
		try {
			// Get API Key
			const apiKey = await context.secrets.get(API_KEY_SECRET);
			if (!apiKey) {
            	const result = await vscode.window.showErrorMessage(
                    'Gemini API key not found',
                    'Set API Key'
                );
				if (result === 'Set API Key') {
				vscode.commands.executeCommand('vscode-gemini-commit-writer.setApiKey');
			}
				return;
		}
		geminiService.setApiKey(apiKey);

		// TODO: Show loading

	} catch (error: any) {
		vscode.window.showErrorMessage(`Error: ${error}`);
	}

})
}