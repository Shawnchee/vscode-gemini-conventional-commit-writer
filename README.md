# Gemini Modular Conventional Commit Writer

**Generate conventional commits in seconds!** ⚡

AI-powered commit messages using Google Gemini (because it's free! 🎉) - No more struggling with commit message format or wording. Just stage your changes, click generate, and get a perfectly formatted conventional commit instantly.

Professional commit messages with a single click using Google's Gemini AI models.

## ✨ Features

- 🤖 **AI-Powered Commit Messages**: Generate conventional commits based on your staged changes **in seconds**
- 📝 **Brief or Detailed**: Choose between single-line commits or multi-line with body and footer
- 💰 **100% Free**: Uses Google Gemini's free tier (no credit card required!)
- ⚡ **Multiple Models**: Choose from Gemini 2.5 Flash, Flash Lite, 2.0 Flash, or 2.0 Flash Lite
- 🎯 **Conventional Commits**: Follows the [Conventional Commits](https://www.conventionalcommits.org/) specification
- 🧩 **Modular**: Automatically generates focused, single-purpose commits based on staged changes
- 🔒 **Secure**: API keys stored securely in VS Code's Secret Storage
- ⌨️ **Keyboard Shortcut**: `Ctrl+Alt+G` (Windows/Linux) or `Cmd+Alt+G` (Mac)
- 🎨 **Git Integration**: Seamlessly integrates with VS Code's Source Control UI

## 🚀 Getting Started

### 1. Install the Extension

**VS Code:**
Search for "Gemini Conventional Commit Writer" in VS Code Extensions marketplace or [install from here](https://marketplace.visualstudio.com/items?itemName=shawnchee.vscode-gemini-commit-writer).

**Cursor IDE:**
Also available on [Open VSX Registry](https://open-vsx.org/extension/shawnchee/vscode-gemini-commit-writer) for Cursor, Antigravity, and VSCodium users.

### 2. Get a Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" (no credit card required!)
3. Copy your API key

> ⚠️ **Privacy Notice:** Google's free tier may use your data for training purposes. If your code contains proprietary information, consider using a paid Gemini API key which offers data protection guarantees. See [Google's data usage policy](https://ai.google.dev/gemini-api/terms) for details.

### 3. Set Your API Key

**Option 1:** Via Command Palette
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Search for "Gemini Commit: Set API Key"
- Paste your API key

**Option 2:** Via Source Control UI
- Open the Source Control view
- Click the gear icon (⚙️) in the SCM title bar
- Select "Set API Key"

### 4. Generate Your First Commit

1. Stage your changes in Git
2. Click the sparkle icon (✨) in the Source Control title bar or use `Ctrl+Alt+G` / `Cmd+Alt+G`
3. Choose commit style:
   - **Brief Commit**: Single-line (e.g., `feat(auth): add google oauth`)
   - **Detailed Commit**: Multi-line with body and footer for context
4. Commit message appears instantly in the input box!

## 🎮 Usage

### Generate Commit Message

**Three ways to generate:**

1. **Button**: Click the sparkle icon (✨) in Source Control toolbar
2. **Keyboard**: Press `Ctrl+Alt+G` (Windows/Linux) or `Cmd+Alt+G` (Mac)
3. **Command Palette**: Run "Gemini Commit: Generate Commit Message"

**Then choose your style:**
- **Brief Commit** - Perfect for quick, straightforward changes
  ```
  feat(api): add user authentication endpoint
  ```
- **Detailed Commit** - For complex changes that need context
  ```
  feat(api): add user authentication endpoint
  
  - Implement JWT token generation and validation
  - Add password hashing with bcrypt
  - Create user session management
  
  This enables secure user authentication and prepares
  the foundation for role-based access control.
  
  Refs: #123
  ```

### Manage Settings

Click the gear icon (⚙️) in Source Control toolbar to access:
- **Set API Key**: Add or update your Gemini API key
- **Clear API Key**: Remove stored API key
- **Open Settings**: Configure extension preferences

## ⚙️ Configuration

Access settings via `File > Preferences > Settings > Extensions > Gemini Commit Writer` or click the gear icon in Source Control.

### Available Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Model** | `gemini-2.5-flash` | Choose your Gemini model (all free!) |
| **Temperature** | `0.1` | Control creativity (0.0 = consistent, 1.0 = creative) |
| **Max Output Tokens** | `500` | Maximum commit message length (~375 words) |
| **Max Diff Length** | `5000` | Maximum git diff size to analyze (characters) |
| **Show Timing Info** | `false` | Display performance metrics after generation |

### Model Comparison

| Model | Best For | Speed | Quality |
|-------|----------|-------|---------|
| **gemini-2.5-flash** ⚡ | Recommended for most users | Fast | High |
| **gemini-2.5-flash-lite** 💡 | High-volume usage | Fastest | Good |

All models are available on Google's **free tier**!

## 📝 Conventional Commits Format

Generated messages follow this format:

```
<type>(<scope>): <description>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add google oauth integration
fix(api): resolve null pointer exception in user service
docs(readme): update installation instructions
refactor(utils): simplify date formatting logic
```

## 🔧 Troubleshooting

### "No staged changes found"
**Solution:** Stage your changes first using `git add` or the Source Control UI.

### "Gemini API key not found"
**Solution:** Set your API key via the gear icon (⚙️) in Source Control or Command Palette.

### "Rate limit exceeded"
**Solution:** Google's free tier has usage limits. Wait a few minutes and try again. Consider:
- Using a lighter model (`gemini-2.5-flash-lite`)
- Reducing `maxDiffLength` in settings
- Waiting between requests

### "Empty response from AI model"
**Solution:** 
- Increase `maxOutputTokens` in settings (try 500-1000)
- Your diff might be too large, reduce `maxDiffLength`
- Try a different model

### API Key Security
Your API key is stored securely using VS Code's Secret Storage API. It's never exposed in settings files or source control.

## 🤝 Contributing

Found a bug or have a feature request? 

- **Report Issues**: [GitHub Issues](https://github.com/Shawnchee/vscode-gemini-commit-writer/issues)
- **Source Code**: [GitHub Repository](https://github.com/Shawnchee/vscode-gemini-commit-writer)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev/)
- Follows [Conventional Commits](https://www.conventionalcommits.org/) specification
- Inspired by the developer community's need for better commit messages

---

**Enjoy writing better commits with AI!** ⭐

If you find this extension helpful, please consider:
- ⭐ [Starring the repository](https://github.com/Shawnchee/vscode-gemini-commit-writer)
- 📝 [Writing a review](https://marketplace.visualstudio.com/items?itemName=shawnchee.vscode-gemini-commit-writer&ssr=false#review-details)
- 🐛 [Reporting bugs](https://github.com/Shawnchee/vscode-gemini-commit-writer/issues)