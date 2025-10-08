class BookmarkletExecutor {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.log('Bookmarklet Executor initialized', 'info');
    }

    bindEvents() {
        // Load site
        document.getElementById('loadSite').addEventListener('click', () => this.loadSite());
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadSite();
        });

        // Run code
        document.getElementById('runBookmarklet').addEventListener('click', () => this.runBookmarklet());
        document.getElementById('runJS').addEventListener('click', () => this.runJavaScript());
        document.getElementById('clearCode').addEventListener('click', () => this.clearCode());

        // Debug controls
        document.getElementById('clearDebug').addEventListener('click', () => this.clearDebug());
        document.getElementById('toggleDebug').addEventListener('click', () => this.toggleDebug());

        // Presets
        document.querySelectorAll('.preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                document.getElementById('codeInput').value = code;
                this.log(`Loaded preset: ${e.target.textContent}`, 'success');
            });
        });

        // Language selector
        document.getElementById('langSelect').addEventListener('change', (e) => {
            this.log(`Language changed to: ${e.target.value}`, 'info');
        });
    }

    loadSite() {
        const urlInput = document.getElementById('urlInput').value.trim();
        
        if (!urlInput || urlInput === 'https://') {
            this.log('Please enter a valid URL', 'error');
            return;
        }

        let url = urlInput;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        this.log(`Loading site: ${url}`, 'info');
        
        try {
            // For security, we'll open in new tab instead of iframe
            window.open(url, '_blank');
            this.log(`Site opened in new tab: ${url}`, 'success');
        } catch (error) {
            this.log(`Error loading site: ${error.message}`, 'error');
        }
    }

    runBookmarklet() {
        const code = document.getElementById('codeInput').value.trim();
        
        if (!code) {
            this.log('Please enter some code to run', 'error');
            return;
        }

        this.log('Executing bookmarklet...', 'info');

        try {
            // Validate it's a proper bookmarklet
            let executableCode = code;
            if (!executableCode.startsWith('javascript:')) {
                executableCode = 'javascript:' + executableCode;
            }

            // Create and click a temporary link
            const tempLink = document.createElement('a');
            tempLink.href = executableCode;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            this.log('Bookmarklet executed successfully', 'success');
        } catch (error) {
            this.log(`Bookmarklet execution failed: ${error.message}`, 'error');
        }
    }

    runJavaScript() {
        const code = document.getElementById('codeInput').value.trim();
        
        if (!code) {
            this.log('Please enter some JavaScript code', 'error');
            return;
        }

        this.log('Executing JavaScript...', 'info');
        this.log(`Code: ${code}`, 'info');

        try {
            // Remove javascript: prefix if present
            let jsCode = code;
            if (jsCode.startsWith('javascript:')) {
                jsCode = jsCode.substring(11);
            }

            // Execute the code
            const result = eval(jsCode);
            
            if (result !== undefined) {
                this.log(`Execution result: ${result}`, 'success');
            } else {
                this.log('JavaScript executed (no return value)', 'success');
            }
        } catch (error) {
            this.log(`JavaScript execution failed: ${error.message}`, 'error');
            console.error('Execution error:', error);
        }
    }

    clearCode() {
        document.getElementById('codeInput').value = '';
        this.log('Code editor cleared', 'info');
    }

    clearDebug() {
        document.getElementById('debugContent').innerHTML = '';
        this.log('Debug console cleared', 'info');
    }

    toggleDebug() {
        const debugContent = document.getElementById('debugContent');
        const toggleBtn = document.getElementById('toggleDebug');
        
        if (debugContent.style.display === 'none') {
            debugContent.style.display = 'block';
            toggleBtn.textContent = 'Hide';
        } else {
            debugContent.style.display = 'none';
            toggleBtn.textContent = 'Show';
        }
    }

    log(message, type = 'info') {
        const debugContent = document.getElementById('debugContent');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `<strong>[${timestamp}]</strong> ${message}`;
        
        debugContent.appendChild(logEntry);
        debugContent.scrollTop = debugContent.scrollHeight;
        
        // Also log to browser console
        switch (type) {
            case 'error':
                console.error(`[BookmarkletExecutor] ${message}`);
                break;
            case 'warning':
                console.warn(`[BookmarkletExecutor] ${message}`);
                break;
            default:
                console.log(`[BookmarkletExecutor] ${message}`);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BookmarkletExecutor();
});

// Add some utility functions to global scope for advanced users
window.BookmarkletUtils = {
    injectScript: function(code) {
        const script = document.createElement('script');
        script.textContent = code;
        document.head.appendChild(script);
        return 'Script injected successfully';
    },
    
    loadExternalScript: function(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve('External script loaded');
            script.onerror = () => reject('Failed to load external script');
            document.head.appendChild(script);
        });
    },
    
    createBookmarklet: function(code, name) {
        const blob = new Blob([`
            <html>
            <head><title>${name}</title></head>
            <body>
                <a href="${code}" id="bookmarklet">Click to run ${name}</a>
                <script>
                    document.getElementById('bookmarklet').click();
                </script>
            </body>
            </html>
        `], {type: 'text/html'});
        return URL.createObjectURL(blob);
    }
};
