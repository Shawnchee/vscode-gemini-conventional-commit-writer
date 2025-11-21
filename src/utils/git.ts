import * as vscode from 'vscode';

export class GitUtils {
    private gitAPI: any = null;

    private async getGitAPI() {
        if (this.gitAPI) {
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

        // Parallelize diff fetching for speed
        const diffPromises = indexChanges.map(async (change: any) => {
            const diff = await repo.diffIndexWithHEAD(change.uri.fsPath);
            return `\nFile: ${change.uri.fsPath}\nStatus: ${this.getChangeStatus(change.status)}\n${diff}\n`;
        });

        const diffs = await Promise.all(diffPromises);
        return diffs.join('');
    }

    private getChangeStatus(status: number): string {
        const statusMap: { [key: number]: string } = {
            0: 'MODIFIED',
            1: 'ADDED',
            2: 'DELETED',
            3: 'RENAMED',
            5: 'MODIFIED',
            6: 'DELETED',
            7: 'UNTRACKED',
        };
        return statusMap[status] || 'CHANGED';
    }

    async setGitCommitMessage(message: string): Promise<void> {
        const git = await this.getGitAPI();
        const repo = git.repositories[0];
        
        if (repo) {
            repo.inputBox.value = message;
        }
    }
}