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

	// Clear API Key Command
	    const clearApiKey = vscode.commands.registerCommand('vscode-gemini-commit-writer.clearApiKey', async () => {
        const result = await vscode.window.showWarningMessage(
            'Are you sure you want to clear your Gemini API Key?',
            'Yes',
            'No'
        );

        if (result === 'Yes') {
            await context.secrets.delete(API_KEY_SECRET);
            vscode.window.showInformationMessage('✓ Gemini API Key cleared.');
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
				await vscode.commands.executeCommand('vscode-gemini-commit-writer.setApiKey');
			}
				return;
		}
		geminiService.setApiKey(apiKey);

		// TODO: Show loading
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Generating commit message...",
			cancellable: false
		}, async () => {
			// Get staged changes
			const gitDiff = await gitUtils.getStagedChanges();
			
			if (!gitDiff || (Array.isArray(gitDiff) && gitDiff.length === 0)) {
				vscode.window.showWarningMessage('No staged changes found.');
				return;
			}

			// Generate commit message
			const commitMessage = await geminiService.generateCommitMessage(gitDiff);

			// Set commit message in Git input box
			await gitUtils.setGitCommitMessage(commitMessage);

			vscode.window.showInformationMessage('Commit message generated successfully.');
		});

	} catch (error: any) {
		vscode.window.showErrorMessage(`Error: ${error}`);
	}

});
	context.subscriptions.push(setApiKey, clearApiKey, generateCommitMessage);
}

export function deactivate() {}