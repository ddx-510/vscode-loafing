# VS Code Loafing Extension (摸鱼插件)

A VS Code extension that simulates coding activity to achieve the "loafing" effect - making it look like you're working hard when you're actually taking a break! 

## Features

- 🐍 **Python Loafing**: Generates realistic Python code with data science, web development, and algorithm patterns
- 🐹 **Go Loafing**: Creates authentic Go code with web servers, structs, and concurrency patterns  
- 📘 **TypeScript Loafing**: Produces modern TypeScript code with React hooks, APIs, and type definitions
- ⌨️ **Realistic Typing**: Simulates human typing speed with natural delays and pauses
- 💬 **Smart Comments**: Adds realistic TODO, FIXME, and NOTE comments
- 🎯 **Multiple Languages**: Switch between Python, Go, and TypeScript on demand

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` to run the extension in a new Extension Development Host window
4. Or package it with `vsce package` and install the `.vsix` file

## Usage

### Commands

- **Start Loafing: Python** (`Ctrl/Cmd+Shift+L P`) - Begin simulating Python development
- **Start Loafing: Go** (`Ctrl/Cmd+Shift+L G`) - Begin simulating Go development  
- **Start Loafing: TypeScript** (`Ctrl/Cmd+Shift+L T`) - Begin simulating TypeScript development
- **Stop Loafing** (`Ctrl/Cmd+Shift+L S`) - Stop the current loafing session

### How It Works

1. Select your preferred programming language
2. The extension creates a new file and starts "typing" realistic code
3. Code includes proper syntax, imports, functions, classes, and comments
4. Typing speed and patterns mimic human behavior
5. Stop anytime with the stop command

## Code Patterns

### Python
- Data science imports (numpy, pandas, sklearn)
- Function definitions with type hints
- Class definitions with proper structure
- Async/await patterns
- Algorithm implementations

### Go
- Package declarations and imports
- Struct definitions with JSON tags
- HTTP handlers and middleware
- Error handling patterns
- Main function setups

### TypeScript
- Interface and type definitions
- React hooks and components
- API service classes
- Async/await patterns
- Generic type usage

## Keyboard Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|-------|
| Python Loafing | `Ctrl+Shift+L P` | `Cmd+Shift+L P` |
| Go Loafing | `Ctrl+Shift+L G` | `Cmd+Shift+L G` |
| TypeScript Loafing | `Ctrl+Shift+L T` | `Cmd+Shift+L T` |
| Stop Loafing | `Ctrl+Shift+L S` | `Cmd+Shift+L S` |

## Disclaimer

This extension is for entertainment purposes only. Please use responsibly and ensure you're still meeting your actual work commitments! 

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

## Contributing

Feel free to contribute more realistic code patterns, additional languages, or improvements to the typing simulation!

## License

MIT License - Feel free to fork and modify as needed.

---

Happy loafing! 摸鱼快乐！ 🐟 