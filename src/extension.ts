import * as vscode from 'vscode';
import { GitUtils } from './utils/git';
import { GeminiGeneratorService } from './services/gemini';

const API_KEY_SECRET = 'geminiApiKey';

export function activate(context: vscode.ExtensionContext) {
    const gitUtils = new GitUtils();
    const geminiService = new GeminiGeneratorService();
    const outputChannel = vscode.window.createOutputChannel('Gemini Commit Writer');
    context.subscriptions.push(outputChannel);

    // Set API Key command
    const setApiKey = vscode.commands.registerCommand('vscode-gemini-commit-writer.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Gemini API Key',
            password: true,
            ignoreFocusOut: true,
            placeHolder: 'AIza...'
        });

        if (apiKey) {
            await context.secrets.store(API_KEY_SECRET, apiKey);
            geminiService.setApiKey(apiKey);
            vscode.window.showInformationMessage('✓ Gemini API Key saved successfully.');
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

    // Open Settings Command
    const openSettings = vscode.commands.registerCommand('vscode-gemini-commit-writer.openSettings', async () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'geminiCommitWriter');
    });

    // Generate commit message command
    const generateCommitMessage = vscode.commands.registerCommand('vscode-gemini-commit-writer.generateCommitMessage', async () => {
        const startTime = Date.now();

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

            // Ask user for type of commit
            const commitType = await vscode.window.showQuickPick([
                                {
                    label: 'Brief Commit',
                    description: 'Single-line conventional commit',
                    detail: 'e.g., feat(auth): add google oauth integration',
                    value: 'brief'
                },
                {
                    label: 'Detailed Commit',
                    description: 'Multi-line with body and footer',
                    detail: 'Includes subject, explanation, and context',
                    value: 'detailed'
                }
            ], {
                placeHolder: 'Select commit message type',
                title: 'Commit Message Type'
            });

            if (!commitType) {
                return; // user cancelled
            }

            const isDetailed = commitType.value === 'detailed';

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Generating ${isDetailed ? 'detailed' : 'brief'} commit message...`,
                cancellable: false
            }, async (progress) => {
                // Get staged changes
                progress.report({ message: 'Reading staged changes...' });
                const gitDiff = await gitUtils.getStagedChanges();
                
                outputChannel.appendLine(`[DEBUG] Git diff length: ${gitDiff?.length || 0} characters`);
                
                if (!gitDiff || gitDiff.trim().length === 0) {
                    vscode.window.showWarningMessage('No staged changes found. Please stage your changes first.');
                    return;
                }

                // Generate commit message
                progress.report({ message: 'Generating with AI...' });
                const commitMessage = await geminiService.generateCommitMessage(gitDiff, isDetailed);

                outputChannel.appendLine(`[SUCCESS] Generated: ${commitMessage}`);

                // Set commit message in Git input box
                await gitUtils.setGitCommitMessage(commitMessage);

                const totalTime = Date.now() - startTime;
                const config = vscode.workspace.getConfiguration('geminiCommitWriter');
                const showTiming = config.get<boolean>('showTimingInfo', false);

                if (showTiming) {
                    vscode.window.showInformationMessage(`✓ Generated in ${(totalTime / 1000).toFixed(2)}s`);
                    outputChannel.appendLine(`⏱️ Total time: ${totalTime}ms`);
                } else {
                    vscode.window.showInformationMessage('✓ Commit message generated!');
                }
            });

        } catch (error: any) {
            const totalTime = Date.now() - startTime;
            outputChannel.appendLine(`❌ Error after ${totalTime}ms: ${error.message}`);
            outputChannel.show();
            vscode.window.showErrorMessage(`Failed to generate commit: ${error.message}`);
        }
    });

    context.subscriptions.push(setApiKey, clearApiKey, openSettings, generateCommitMessage);
}

export function deactivate() {}