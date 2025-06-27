import * as vscode from 'vscode';

// Webview provider for the side panel
class LoafingSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'loafingExplorer';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'startPython':
                    vscode.commands.executeCommand('loafing.startPython');
                    break;
                case 'startGolang':
                    vscode.commands.executeCommand('loafing.startGolang');
                    break;
                case 'startTypeScript':
                    vscode.commands.executeCommand('loafing.startTypeScript');
                    break;
                case 'stop':
                    vscode.commands.executeCommand('loafing.stop');
                    break;
                case 'showPanel':
                    vscode.commands.executeCommand('loafing.showPanel');
                    break;
            }
        });
    }

    public updateStatus() {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'updateStatus',
                isLoafing: isLoafing
            });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Loafing Control</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        font-size: var(--vscode-font-size);
                        background-color: var(--vscode-sideBar-background);
                        color: var(--vscode-sideBar-foreground);
                        padding: 12px;
                        margin: 0;
                    }
                    
                    .status {
                        text-align: center;
                        margin-bottom: 20px;
                        padding: 12px;
                        border-radius: 8px;
                        background-color: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        font-weight: 600;
                        font-size: 14px;
                    }
                    
                    .status.active {
                        background-color: var(--vscode-inputValidation-infoBackground);
                        color: var(--vscode-inputValidation-infoForeground);
                        border: 1px solid var(--vscode-inputValidation-infoBorder);
                    }
                    
                    .section {
                        margin-bottom: 24px;
                    }
                    
                    .section-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: var(--vscode-sideBarSectionHeader-foreground);
                        margin-bottom: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .button {
                        width: 100%;
                        padding: 12px 16px;
                        margin-bottom: 8px;
                        border: 1px solid var(--vscode-button-border);
                        border-radius: 6px;
                        background-color: var(--vscode-button-secondaryBackground);
                        color: var(--vscode-button-secondaryForeground);
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                        text-align: left;
                        font-family: var(--vscode-font-family);
                    }
                    
                    .button:hover {
                        background-color: var(--vscode-button-secondaryHoverBackground);
                        transform: translateY(-1px);
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    
                    .button:active {
                        transform: translateY(0);
                    }
                    
                    .button.primary {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                    }
                    
                    .button.primary:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    
                    .button.danger {
                        background-color: var(--vscode-inputValidation-errorBackground);
                        color: var(--vscode-inputValidation-errorForeground);
                        border-color: var(--vscode-inputValidation-errorBorder);
                    }
                    
                    .button.danger:hover {
                        opacity: 0.9;
                    }
                    
                    .emoji {
                        font-size: 16px;
                    }
                    
                    .footer {
                        margin-top: 30px;
                        padding-top: 16px;
                        border-top: 1px solid var(--vscode-sideBar-border);
                        text-align: center;
                        font-size: 11px;
                        color: var(--vscode-descriptionForeground);
                    }
                </style>
            </head>
            <body>
                <div class="status" id="status">
                    <span class="emoji">😴</span> Not Loafing
                </div>
                
                <div class="section">
                    <div class="section-title">Start Loafing</div>
                    <button class="button" onclick="startLoafing('python')">
                        <span class="emoji">🐍</span>
                        Python
                    </button>
                    <button class="button" onclick="startLoafing('golang')">
                        <span class="emoji">🐹</span>
                        Go
                    </button>
                    <button class="button" onclick="startLoafing('typescript')">
                        <span class="emoji">📘</span>
                        TypeScript
                    </button>
                </div>
                
                <div class="section">
                    <div class="section-title">Controls</div>
                    <button class="button danger" onclick="stopLoafing()">
                        <span class="emoji">⏹️</span>
                        Stop Loafing
                    </button>
                    <button class="button primary" onclick="showPanel()">
                        <span class="emoji">📊</span>
                        Show Panel
                    </button>
                </div>
                
                <div class="footer">
                    摸鱼快乐 🐟
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function startLoafing(language) {
                        vscode.postMessage({
                            type: 'start' + language.charAt(0).toUpperCase() + language.slice(1)
                        });
                    }
                    
                    function stopLoafing() {
                        vscode.postMessage({
                            type: 'stop'
                        });
                    }
                    
                    function showPanel() {
                        vscode.postMessage({
                            type: 'showPanel'
                        });
                    }
                    
                    // Listen for status updates
                    window.addEventListener('message', event => {
                        const message = event.data;
                        
                        if (message.type === 'updateStatus') {
                            const statusElement = document.getElementById('status');
                            if (message.isLoafing) {
                                statusElement.innerHTML = '<span class="emoji">🚀</span> Currently Loafing...';
                                statusElement.className = 'status active';
                            } else {
                                statusElement.innerHTML = '<span class="emoji">😴</span> Not Loafing';
                                statusElement.className = 'status';
                            }
                        }
                    });
                </script>
            </body>
            </html>`;
    }
}

let loafingInterval: NodeJS.Timeout | undefined;
let currentDocument: vscode.TextDocument | undefined;
let isLoafing = false;
let loafingPanel: vscode.WebviewPanel | undefined;
let loafingSidebarProvider: LoafingSidebarProvider;

// Code templates for different languages
const codeTemplates = {
    python: [
        'import requests\nimport json\nfrom typing import List, Dict, Optional\nfrom datetime import datetime, timedelta\n',
        'def validate_email(email: str) -> bool:\n    """Validate email format using regex."""\n    import re\n    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"\n    return re.match(pattern, email) is not None\n',
        'class APIClient:\n    def __init__(self, base_url: str, api_key: str):\n        self.base_url = base_url.rstrip("/")\n        self.api_key = api_key\n        self.session = requests.Session()\n        self.session.headers.update({"Authorization": f"Bearer {api_key}"})\n    \n    def get(self, endpoint: str) -> Dict:\n        response = self.session.get(f"{self.base_url}/{endpoint}")\n        response.raise_for_status()\n        return response.json()\n',
        'def process_batch_data(items: List[Dict], batch_size: int = 100) -> List[Dict]:\n    """Process data in batches for better performance."""\n    results = []\n    for i in range(0, len(items), batch_size):\n        batch = items[i:i + batch_size]\n        processed_batch = []\n        for item in batch:\n            if item.get("status") == "active":\n                item["processed_at"] = datetime.now().isoformat()\n                processed_batch.append(item)\n        results.extend(processed_batch)\n    return results\n',
        '@property\ndef is_expired(self) -> bool:\n    """Check if the token has expired."""\n    if not self.expires_at:\n        return True\n    return datetime.now() > self.expires_at\n\ndef refresh_token(self) -> bool:\n    """Refresh the authentication token."""\n    try:\n        response = self.session.post(\n            f"{self.base_url}/auth/refresh",\n            json={"refresh_token": self.refresh_token}\n        )\n        if response.status_code == 200:\n            data = response.json()\n            self.access_token = data["access_token"]\n            self.expires_at = datetime.now() + timedelta(seconds=data["expires_in"])\n            return True\n    except Exception as e:\n        logging.error(f"Token refresh failed: {e}")\n    return False\n',
        'def calculate_metrics(data: List[float]) -> Dict[str, float]:\n    """Calculate statistical metrics for a dataset."""\n    if not data:\n        return {}\n    \n    sorted_data = sorted(data)\n    n = len(data)\n    mean_val = sum(data) / n\n    \n    # Calculate median\n    if n % 2 == 0:\n        median_val = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2\n    else:\n        median_val = sorted_data[n//2]\n    \n    # Calculate variance and standard deviation\n    variance = sum((x - mean_val) ** 2 for x in data) / n\n    std_dev = variance ** 0.5\n    \n    return {\n        "count": n,\n        "mean": round(mean_val, 4),\n        "median": round(median_val, 4),\n        "min": min(data),\n        "max": max(data),\n        "std_dev": round(std_dev, 4),\n        "variance": round(variance, 4)\n    }\n'
    ],
    golang: [
        'import (\n    "fmt"\n    "time"\n    "context"\n    "database/sql"\n)\n',
        'type User struct {\n    ID       int       `json:"id" db:"id"`\n    Name     string    `json:"name" db:"name"`\n    Email    string    `json:"email" db:"email"`\n    Created  time.Time `json:"created" db:"created_at"`\n}\n',
        'func (u *User) Validate() error {\n    if u.Name == "" {\n        return fmt.Errorf("name is required")\n    }\n    if u.Email == "" {\n        return fmt.Errorf("email is required")\n    }\n    return nil\n}\n',
        'func processDataConcurrently(data []int, workers int) []int {\n    jobs := make(chan int, len(data))\n    results := make(chan int, len(data))\n    \n    for w := 0; w < workers; w++ {\n        go func() {\n            for job := range jobs {\n                results <- job * 2\n            }\n        }()\n    }\n    \n    for _, value := range data {\n        jobs <- value\n    }\n    close(jobs)\n    \n    var processed []int\n    for i := 0; i < len(data); i++ {\n        processed = append(processed, <-results)\n    }\n    \n    return processed\n}\n',
        'func handleUserCreation(ctx context.Context, db *sql.DB, user User) error {\n    query := `INSERT INTO users (name, email, created_at) VALUES ($1, $2, $3)`\n    _, err := db.ExecContext(ctx, query, user.Name, user.Email, time.Now())\n    if err != nil {\n        return fmt.Errorf("failed to create user: %w", err)\n    }\n    return nil\n}\n',
        'func calculateMetrics(data []float64) map[string]float64 {\n    if len(data) == 0 {\n        return map[string]float64{}\n    }\n    \n    var sum, min, max float64\n    min = data[0]\n    max = data[0]\n    \n    for _, v := range data {\n        sum += v\n        if v < min {\n            min = v\n        }\n        if v > max {\n            max = v\n        }\n    }\n    \n    return map[string]float64{\n        "sum":     sum,\n        "average": sum / float64(len(data)),\n        "min":     min,\n        "max":     max,\n    }\n}\n'
    ],
    typescript: [
        'interface User {\n  id: string;\n  email: string;\n  name: string;\n  role: "admin" | "user" | "moderator";\n  createdAt: Date;\n  isActive: boolean;\n}\n\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n  timestamp: string;\n}\n',
        'export class AuthService {\n  private readonly apiUrl: string;\n  private accessToken: string | null = null;\n\n  constructor(apiUrl: string) {\n    this.apiUrl = apiUrl;\n  }\n\n  async login(email: string, password: string): Promise<boolean> {\n    try {\n      const response = await fetch(`${this.apiUrl}/auth/login`, {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ email, password })\n      });\n      \n      if (response.ok) {\n        const data = await response.json();\n        this.accessToken = data.accessToken;\n        localStorage.setItem("token", this.accessToken!);\n        return true;\n      }\n    } catch (error) {\n      console.error("Login failed:", error);\n    }\n    return false;\n  }\n}\n',
        'const useDebounce = <T>(value: T, delay: number): T => {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n};\n\nexport const useApi = <T>(url: string, options?: RequestInit) => {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(url, options);\n        if (!response.ok) throw new Error(`HTTP ${response.status}`);\n        const result = await response.json();\n        setData(result);\n      } catch (err) {\n        setError(err instanceof Error ? err.message : "Unknown error");\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n};\n',
        'export class DataProcessor<T> {\n  private items: T[] = [];\n  private batchSize: number;\n\n  constructor(batchSize = 50) {\n    this.batchSize = batchSize;\n  }\n\n  addItems(newItems: T[]): void {\n    this.items.push(...newItems);\n  }\n\n  async processInBatches<R>(\n    processor: (batch: T[]) => Promise<R[]>\n  ): Promise<R[]> {\n    const results: R[] = [];\n    \n    for (let i = 0; i < this.items.length; i += this.batchSize) {\n      const batch = this.items.slice(i, i + this.batchSize);\n      const batchResults = await processor(batch);\n      results.push(...batchResults);\n      \n      // Add small delay to prevent overwhelming the system\n      await new Promise(resolve => setTimeout(resolve, 10));\n    }\n    \n    return results;\n  }\n\n  getStats(): { total: number; batches: number } {\n    return {\n      total: this.items.length,\n      batches: Math.ceil(this.items.length / this.batchSize)\n    };\n  }\n}\n',
        'export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => string | null>): Record<string, string> => {\n  const errors: Record<string, string> = {};\n  \n  for (const [field, validator] of Object.entries(rules)) {\n    const error = validator(data[field]);\n    if (error) {\n      errors[field] = error;\n    }\n  }\n  \n  return errors;\n};\n\nexport const createValidationRules = () => ({\n  required: (value: any) => !value ? "This field is required" : null,\n  email: (value: string) => {\n    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n    return !emailRegex.test(value) ? "Invalid email format" : null;\n  },\n  minLength: (min: number) => (value: string) => \n    value.length < min ? `Minimum ${min} characters required` : null,\n  maxLength: (max: number) => (value: string) => \n    value.length > max ? `Maximum ${max} characters allowed` : null\n});\n',
        'interface CacheItem<T> {\n  data: T;\n  timestamp: number;\n  ttl: number;\n}\n\nexport class MemoryCache<T> {\n  private cache = new Map<string, CacheItem<T>>();\n  private defaultTTL: number;\n\n  constructor(defaultTTL = 300000) { // 5 minutes default\n    this.defaultTTL = defaultTTL;\n  }\n\n  set(key: string, data: T, ttl = this.defaultTTL): void {\n    this.cache.set(key, {\n      data,\n      timestamp: Date.now(),\n      ttl\n    });\n  }\n\n  get(key: string): T | null {\n    const item = this.cache.get(key);\n    if (!item) return null;\n\n    if (Date.now() - item.timestamp > item.ttl) {\n      this.cache.delete(key);\n      return null;\n    }\n\n    return item.data;\n  }\n\n  clear(): void {\n    this.cache.clear();\n  }\n\n  size(): number {\n    return this.cache.size;\n  }\n}\n'
    ]
};

// Comments to add randomly
const comments = {
    python: [
        '# TODO: Optimize this algorithm for better performance',
        '# FIXME: Handle edge cases properly',
        '# NOTE: This needs to be refactored',
        '# BUG: Memory leak in production environment',
        '# HACK: Temporary solution, needs proper implementation'
    ],
    golang: [
        '// TODO: Add proper error handling',
        '// FIXME: Race condition possible here',
        '// NOTE: Consider using goroutines for better performance',
        '// BUG: Potential memory leak',
        '// HACK: Quick fix, needs refactoring'
    ],
    typescript: [
        '// TODO: Add type safety checks',
        '// FIXME: Handle async errors properly',
        '// NOTE: Consider using React.memo for optimization',
        '// BUG: State not updating correctly',
        '// HACK: Workaround for API limitation'
    ]
};

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

async function simulateTyping(editor: vscode.TextEditor, text: string): Promise<boolean> {
    const characters = text.split('');
    
    for (let i = 0; i < characters.length; i++) {
        if (!isLoafing) {
            return false;
        }
        
        const char = characters[i];
        
        // Add realistic thinking pauses
        if (char === '\n' || char === '{' || char === '(' || char === ' ') {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
        } else {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 80));
        }
        
        if (!isLoafing) {
            return false;
        }
        
        // Insert character at current cursor position
        await editor.edit(editBuilder => {
            const position = editor.selection.active;
            editBuilder.insert(position, char);
        });
        
        // Add occasional pauses for "thinking"
        if (Math.random() < 0.08) { // 8% chance to pause and think
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 800));
        }
        
        // Add occasional typos and corrections (5% chance)
        if (Math.random() < 0.05 && char.match(/[a-zA-Z]/)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!isLoafing) return false;
            
            // Add a wrong character
            const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
            await editor.edit(editBuilder => {
                const position = editor.selection.active;
                editBuilder.insert(position, wrongChar);
            });
            
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
            if (!isLoafing) return false;
            
            // Delete the wrong character
            await editor.edit(editBuilder => {
                const position = editor.selection.active;
                const range = new vscode.Range(position.translate(0, -1), position);
                editBuilder.delete(range);
            });
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return true;
}

async function addRandomCode(language: 'python' | 'golang' | 'typescript'): Promise<void> {
    if (!isLoafing) {
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    if (!editor || !currentDocument) {
        return;
    }

    // Check if we're still in the right document
    if (editor.document !== currentDocument) {
        return;
    }

    // Add thinking pause before typing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    if (!isLoafing) return;

    const shouldAddComment = Math.random() > 0.6;
    
    if (shouldAddComment) {
        const comment = getRandomElement(comments[language]);
        const success = await simulateTyping(editor, comment + '\n');
        if (!success || !isLoafing) return;
        
        // Pause after comment
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 300));
        if (!isLoafing) return;
    }

    const codeSnippet = getRandomElement(codeTemplates[language]);
    await simulateTyping(editor, codeSnippet + '\n\n');
    
    // Pause after completing a code block
    if (isLoafing) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 800));
    }
}

async function startLoafing(language: 'python' | 'golang' | 'typescript'): Promise<void> {
    // Stop any existing loafing session
    if (loafingInterval) {
        clearTimeout(loafingInterval);
        loafingInterval = undefined;
    }
    
    isLoafing = true;

    let initialContent: string;
    if (language === 'golang') {
        initialContent = 'package main\n\n// Loafing in Go... 摸鱼中...\n\n';
    } else if (language === 'python') {
        initialContent = '#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n"""\\nLoafing in Python... 摸鱼中...\\n"""\n\n';
    } else {
        initialContent = '// Loafing in TypeScript... 摸鱼中...\n\n';
    }

    // Create or open a file for the selected language
    let languageId: string;
    if (language === 'golang') {
        languageId = 'go';
    } else if (language === 'typescript') {
        languageId = 'typescript';
    } else {
        languageId = 'python';
    }
    
    try {
        const doc = await vscode.workspace.openTextDocument({
            language: languageId,
            content: initialContent
        });
        
        currentDocument = doc;
        console.log(`Created document with language: ${doc.languageId}, URI: ${doc.uri.toString()}`);
        
        const editor = await vscode.window.showTextDocument(doc);
        
        // Set cursor at the end
        const lastLine = doc.lineCount - 1;
        const lastCharacter = doc.lineAt(lastLine).text.length;
        const position = new vscode.Position(lastLine, lastCharacter);
        editor.selection = new vscode.Selection(position, position);

        // Start the loafing simulation
        const loafingFunction = async () => {
            if (isLoafing) {
                try {
                    await addRandomCode(language);
                } catch (err) {
                    console.error('Error during loafing simulation:', err);
                }
                
                // Schedule next code addition with random delay
                if (isLoafing) {
                    const nextDelay = Math.random() * 4000 + 2000; // 2-6 seconds
                    loafingInterval = setTimeout(loafingFunction, nextDelay);
                }
            }
        };
        
        // Start first code addition after a short delay
        loafingInterval = setTimeout(loafingFunction, 2000);

        vscode.window.showInformationMessage(`Started loafing in ${language}! 开始摸鱼！`);
        
        // Update panel if it exists
        updatePanelState();
        
    } catch (error: any) {
        console.error(`Failed to create ${language} document:`, error);
        vscode.window.showErrorMessage(`Failed to start ${language} loafing: ${error.message || error}`);
        isLoafing = false;
    }
}

function stopLoafing(): void {
    isLoafing = false;
    
    if (loafingInterval) {
        clearTimeout(loafingInterval);
        loafingInterval = undefined;
        vscode.window.showInformationMessage('Stopped loafing! 停止摸鱼！');
    } else {
        vscode.window.showWarningMessage('No loafing session is currently active.');
    }
    
    // Update panel if it exists
    updatePanelState();
}

function updatePanelState(): void {
    if (loafingPanel) {
        loafingPanel.webview.postMessage({
            command: 'updateState',
            isLoafing: isLoafing
        });
    }
    
    // Update the sidebar status
    if (loafingSidebarProvider) {
        loafingSidebarProvider.updateStatus();
    }
}

function createLoafingPanel(context: vscode.ExtensionContext): void {
    if (loafingPanel) {
        loafingPanel.reveal(vscode.ViewColumn.Beside);
        return;
    }

    loafingPanel = vscode.window.createWebviewPanel(
        'loafingPanel',
        'Loafing Control Panel 摸鱼控制台',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    loafingPanel.webview.html = getWebviewContent();

    // Handle messages from the webview
    loafingPanel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'startPython':
                    startLoafing('python');
                    break;
                case 'startGolang':
                    startLoafing('golang');
                    break;
                case 'startTypeScript':
                    startLoafing('typescript');
                    break;
                case 'stop':
                    stopLoafing();
                    break;
            }
        },
        undefined,
        context.subscriptions
    );

    // Clean up when panel is disposed
    loafingPanel.onDidDispose(
        () => {
            loafingPanel = undefined;
        },
        null,
        context.subscriptions
    );

    // Update initial state
    updatePanelState();
}

function getWebviewContent(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loafing Control Panel</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            margin: 0;
        }
        
        .container {
            max-width: 400px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: var(--vscode-textLink-foreground);
        }
        
        .button-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        button {
            padding: 15px 20px;
            border: 1px solid var(--vscode-button-border);
            border-radius: 6px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: translateY(-1px);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .language-btn {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .language-btn:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .stop-btn {
            background-color: var(--vscode-errorForeground);
            color: white;
            font-weight: bold;
        }
        
        .stop-btn:hover {
            background-color: #d73a49;
        }
        
        .status {
            text-align: center;
            padding: 15px;
            border-radius: 6px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            margin-top: 20px;
        }
        
        .emoji {
            font-size: 18px;
        }
        
        .description {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 20px;
            font-style: italic;
        }
        
        .keyboard-shortcuts {
            margin-top: 30px;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-radius: 6px;
        }
        
        .keyboard-shortcuts h3 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
        }
        
        .shortcut-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-family: monospace;
            font-size: 12px;
        }
        
        .key {
            background-color: var(--vscode-keybindingLabel-background);
            color: var(--vscode-keybindingLabel-foreground);
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid var(--vscode-keybindingLabel-border);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><span class="emoji">🐟</span> Loafing Control Panel 摸鱼控制台</h1>
        
        <div class="description">
            Choose your programming language and start pretending to work hard!
        </div>
        
        <div class="button-group">
            <button class="language-btn" onclick="startLoafing('python')">
                <span class="emoji">🐍</span>
                Start Python Loafing
            </button>
            
            <button class="language-btn" onclick="startLoafing('golang')">
                <span class="emoji">🐹</span>
                Start Go Loafing
            </button>
            
            <button class="language-btn" onclick="startLoafing('typescript')">
                <span class="emoji">📘</span>
                Start TypeScript Loafing
            </button>
            
            <button class="stop-btn" onclick="stopLoafing()">
                <span class="emoji">⏹️</span>
                Stop Loafing
            </button>
        </div>
        
        <div class="status" id="status">
            <span class="emoji">😴</span> Not currently loafing
        </div>
        
        <div class="keyboard-shortcuts">
            <h3>Keyboard Shortcuts</h3>
            <div class="shortcut-item">
                <span>Python:</span>
                <span class="key">Cmd+Shift+L P</span>
            </div>
            <div class="shortcut-item">
                <span>Go:</span>
                <span class="key">Cmd+Shift+L G</span>
            </div>
            <div class="shortcut-item">
                <span>TypeScript:</span>
                <span class="key">Cmd+Shift+L T</span>
            </div>
            <div class="shortcut-item">
                <span>Stop:</span>
                <span class="key">Cmd+Shift+L S</span>
            </div>
            <div class="shortcut-item">
                <span>Panel:</span>
                <span class="key">Cmd+Shift+L Cmd+Shift+L</span>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function startLoafing(language) {
            vscode.postMessage({
                command: 'start' + language.charAt(0).toUpperCase() + language.slice(1)
            });
        }
        
        function stopLoafing() {
            vscode.postMessage({
                command: 'stop'
            });
        }
        
        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.command === 'updateState') {
                const statusElement = document.getElementById('status');
                if (message.isLoafing) {
                    statusElement.innerHTML = '<span class="emoji">🚀</span> Currently loafing... 摸鱼中...';
                    statusElement.style.borderLeftColor = 'var(--vscode-notificationsInfoIcon-foreground)';
                } else {
                    statusElement.innerHTML = '<span class="emoji">😴</span> Not currently loafing';
                    statusElement.style.borderLeftColor = 'var(--vscode-textLink-foreground)';
                }
            }
        });
    </script>
</body>
</html>`;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Loafing extension is now active! 摸鱼插件已激活！');

    // Initialize sidebar provider
    loafingSidebarProvider = new LoafingSidebarProvider(context.extensionUri);
    
    // Register webview view provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(LoafingSidebarProvider.viewType, loafingSidebarProvider)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('loafing.startPython', () => startLoafing('python')),
        vscode.commands.registerCommand('loafing.startGolang', () => startLoafing('golang')),
        vscode.commands.registerCommand('loafing.startTypeScript', () => startLoafing('typescript')),
        vscode.commands.registerCommand('loafing.stop', stopLoafing),
        vscode.commands.registerCommand('loafing.showPanel', () => createLoafingPanel(context))
    );

    // Clean up when extension is deactivated
    context.subscriptions.push({
        dispose: () => {
            isLoafing = false;
            if (loafingInterval) {
                clearTimeout(loafingInterval);
                loafingInterval = undefined;
            }
            if (loafingPanel) {
                loafingPanel.dispose();
                loafingPanel = undefined;
            }
        }
    });
}

export function deactivate() {
    isLoafing = false;
    if (loafingInterval) {
        clearTimeout(loafingInterval);
        loafingInterval = undefined;
    }
    if (loafingPanel) {
        loafingPanel.dispose();
        loafingPanel = undefined;
    }
} 