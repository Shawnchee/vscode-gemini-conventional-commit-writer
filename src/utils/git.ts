import * as vscode from 'vscode'

export class GitUtils {
    private gitAPI: any = null;

    // Cache Git API to avoid repeated lookups
    private async getGitAPI() {
        if (this.gitAPI){
            return this.gitAPI;
        }

        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        this.gitAPI = gitExtension?.getAPI(1);

        if (!this.gitAPI) {
            throw new Error('Git extension not found');
        }
        return this.gitAPI;
    }

    async getStagedChanges(): Promise<string> {
        const git = await this.getGitAPI();

        if (git.repositories.length === 0) {
            throw new Error('No Git repository found');
        }

        const repo = git.repositories[0];
        const indexChanges = repo.state.indexChanges;

        if (!indexChanges || indexChanges.length === 0) {
            return '';
        }

        // Get the actual diff for each staged file
        let fullDiff = '';
        for (const change of indexChanges) {
            const uri = change.uri;
            const diff = await repo.diffIndexWithHEAD(uri.fsPath);
            fullDiff += `\nFile: ${change.uri.fsPath}\n`;
            fullDiff += `Status: ${this.getChangeStatus(change.status)}\n`;
            fullDiff += diff + '\n';
        }

        return fullDiff;
    }
    

    private getChangeStatus(status: number): string {
        const statusMap: { [key: number]: string } = {
            0: 'INDEX_MODIFIED',
            1: 'INDEX_ADDED',
            2: 'INDEX_DELETED',
            3: 'INDEX_RENAMED',
            4: 'INDEX_COPIED',
            5: 'MODIFIED',
            6: 'DELETED',
            7: 'UNTRACKED',
            8: 'IGNORED',
            9: 'INTENT_TO_ADD'
        };
        return statusMap[status] || 'UNKNOWN';
    }

    async setGitCommitMessage(message: string): Promise<void> {
        const git = await this.getGitAPI();

        const repo = git.repositories[0];
        if (repo) {
            repo.inputBox.value = message;
        }
    }
}