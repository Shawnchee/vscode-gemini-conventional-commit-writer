import * as vscode from 'vscode'

export class GitUtils {
    async getStagedChanges(): Promise<string> {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const git = gitExtension?.getAPI(1);

        if (!git) {
            throw new Error('Git extension not found');
        }

        const repo = git.repositories[0];
        if (!repo) {
            throw new Error('No Git repository found');
        }

        const gitDiff = await repo.diffIndexWithHEAD();
        return gitDiff;
    }

    async setGitCommitMessage(message: string): Promise<void> {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const git = gitExtension?.getAPI(1);

        if (!git) {
            throw new Error('Git extension not found');
        }

        const repo = git.repositories[0];
        if (repo) {
            repo.inputBox.value = message;
        }
    }
}