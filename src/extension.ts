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
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Generating commit message...",
			cancellable: false
		}, async () => {
			// Get staged changes
			const gitDiff = await gitUtils.getStagedChanges();
			console.log('[DEBUG] Staged Changes Diff:', gitDiff);
			
			// Also show in output channel for easier viewing
            const outputChannel = vscode.window.createOutputChannel('Gemini Commit Writer');
            outputChannel.appendLine('=== GIT DIFF DEBUG ===');
            outputChannel.appendLine(`Type: ${typeof gitDiff}`);
            outputChannel.appendLine(`Length: ${gitDiff?.length}`);
            outputChannel.appendLine(`Content:\n${gitDiff}`);
            outputChannel.appendLine('=== END DEBUG ===');
            outputChannel.show();
		
			if (!gitDiff) {
				vscode.window.showWarningMessage('No staged changes found.');
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
	context.subscriptions.push(setApiKey, generateCommitMessage);
}

export function deactivate() {}