# Change Log

All notable changes to the "Gemini Conventional Commit Writer" extension will be documented in this file.

## [1.1.2] - 2025-12-11

### Fix
- Fixed minor bugs (removed gemini-2.0 model descriptions)

## [1.1.1] - 2025-12-07

### Fix
- Fixed minor bugs (removed gemini-2.0-flash and gemini-2.0-flash-lite due to deprecation)

## [1.1.0] - 2025-11-26

### Added
- **Commit Type Selection**: Choose between brief or detailed commit messages
  - Brief: Single-line conventional commits for quick changes
  - Detailed: Multi-line commits with body and footer for complex changes
- Enhanced AI prompts for both brief and detailed commit generation
- Dynamic token allocation (300 for brief, 1000 for detailed)
- Interactive quick pick dialog for commit style selection

### Improved
- Better user experience with clear commit type descriptions
- Smarter prompt engineering for detailed commits with body and footer guidelines
- Increased default `maxDiffLength` to 8000 characters for larger changesets

## [1.0.5] - 2025-11-23

### Added
- Support for Cursor IDE, Antigravity and other IDE using Open VSX Registry

## [1.0.4] - 2025-11-23

### Fix
- Fixed minor bugs

## [1.0.3] - 2025-11-23

### Fix
- Fixed minor bugs

## [1.0.2] - 2025-11-23

### Improved
- Optimized AI prompt for better accuracy and conciseness
- Added practical examples in prompt for better learning
- Better structured prompt (clear sections: FORMAT, RULES, TYPES, EXAMPLES)

### Added
- Published to Open VSX Registry (now available for Cursor IDE users)

## [1.0.1] - 2025-11-21
- Initial release
- Generate conventional commit messages using Gemini AI
- Configurable model, temperature, and output length
- Secure API key storage