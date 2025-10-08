class NeonBookmarkletExecutor {
    constructor() {
        this.sidebarOpen = false;
        this.autoScroll = true;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveTab('bookmarklets');
        this.log('NEON Bookmarklet Executor Initialized!', 'success');
    }

    bindEvents() {
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.setActiveTab(tabName);
            });
        });

        // Main functionality
        document.getElementById('loadSite').addEventListener('click', () => this.loadSite());
        document.getElementById('runBookmarklet').addEventListener('click', () => this.runBookmarklet());
        document.getElementById('runJS').addEventListener('click', () => this.runJavaScript());
        document.getElementById('clearCode').addEventListener('click', () => this.clearCode());

        // Debug controls
        document.getElementById('clearDebug').addEventListener('click', () => this.clearDebug());
        document.getElementById('exportLog').addEventListener('click', () => this.exportLog());
        document.getElementById('toggleAutoScroll').addEventListener('click', () => this.toggleAutoScroll());

        // Presets
        document.querySelectorAll('.preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                document.getElementById('codeInput').value = code;
                this.log(`Preset loaded: ${e.target.textContent}`, 'success');
                this.setActiveTab('bookmarklets');
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.runQuickAction(action);
            });
        });

        // Enter key for URL input
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadSite();
        });
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        document.getElementById('sidebar').classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('sidebar-open');
        
        if (this.sidebarOpen) {
            this.log('Sidebar opened', 'info');
        }
    }

    setActiveTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.log(`Switched to ${tabName.toUpperCase()} tab`, 'info');
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

        this.log(`Loading: ${url}`, 'info');
        
        try {
            window.open(url, '_blank');
            this.log(`✅ Site opened in new tab`, 'success');
        } catch (error) {
            this.log(`❌ Failed to load: ${error.message}`, 'error');
        }
    }

    runBookmarklet() {
        const code = document.getElementById('codeInput').value.trim();
        
        if (!code) {
            this.log('Please enter some code', 'error');
            return;
        }

        this.log('Executing bookmarklet...', 'info');

        try {
            let executableCode = code;
            if (!executableCode.startsWith('javascript:')) {
                executableCode = 'javascript:' + executableCode;
            }

            const tempLink = document.createElement('a');
            tempLink.href = executableCode;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            this.log('✅ Bookmarklet executed!', 'success');
        } catch (error) {
            this.log(`❌ Execution failed: ${error.message}`, 'error');
        }
    }

    runJavaScript() {
        const code = document.getElementById('codeInput').value.trim();
        
        if (!code) {
            this.log('Please enter JavaScript code', 'error');
            return;
        }

        this.log('Running JavaScript...', 'info');

        try {
            let jsCode = code;
            if (jsCode.startsWith('javascript:')) {
                jsCode = jsCode.substring(11);
            }

            const result = eval(jsCode);
            
            if (result !== undefined) {
                this.log(`✅ Result: ${result}`, 'success');
            } else {
                this.log('✅ Code executed (no return value)', 'success');
            }
        } catch (error) {
            this.log(`❌ JavaScript error: ${error.message}`, 'error');
        }
    }

    runQuickAction(action) {
        const actions = {
            rainbow: "javascript:(function(){let s=document.createElement('style');s.innerHTML='*{animation:rainbow 2s infinite;} @keyframes rainbow{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}';document.head.appendChild(s);})();",
            disco: "javascript:(function(){let s=document.createElement('style');s.innerHTML='body{animation:disco 0.5s infinite;} @keyframes disco{0%{background:#ff0000;}25%{background:#00ff00;}50%{background:#0000ff;}75%{background:#ffff00;}100%{background:#ff00ff;}}';document.head.appendChild(s);})();",
            matrix: "javascript:(function(){document.body.style.background='#000';document.body.style.color='#0f0';document.body.style.fontFamily='Courier New';let chars='0123456789ABCDEF';setInterval(()=>{let e=document.createElement('div');e.textContent=chars.charAt(Math.floor(Math.random()*chars.length));e.style.position='fixed';e.style.top='0';e.style.left=Math.random()*100+'vw';e.style.animation='fall linear forwards';document.body.appendChild(e);setTimeout(()=>e.remove(),2000);},50);let s=document.createElement('style');s.innerHTML='@keyframes fall{to{top:100vh;}}';document.head.appendChild(s);})();"
        };

        if (actions[action]) {
            document.getElementById('codeInput').value = actions[action];
            this.log(`Quick action loaded: ${action.toUpperCase()}`, 'success');
            this.setActiveTab('bookmarklets');
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

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const btn = document.getElementById('toggleAutoScroll');
        btn.textContent = `AUTO SCROLL: ${this.autoScroll ? 'ON' : 'OFF'}`;
        btn.classList.toggle('green', this.autoScroll);
        btn.classList.toggle('orange', !this.autoScroll);
        this.log(`Auto-scroll ${this.autoScroll ? 'enabled' : 'disabled'}`, 'info');
    }

    exportLog() {
        const logContent = document.getElementById('debugContent').innerText;
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookmarklet-log.txt';
        a.click();
        URL.revokeObjectURL(url);
        this.log('Log exported as bookmarklet-log.txt', 'success');
    }

    log(message, type = 'info') {
        const debugContent = document.getElementById('debugContent');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `<strong>[${timestamp}]</strong> ${message}`;
        
        debugContent.appendChild(logEntry);
        
        if (this.autoScroll) {
            debugContent.scrollTop = debugContent.scrollHeight;
        }

        // Console logging
        const consoleMsg = `[Bookmarklet] ${message}`;
        switch (type) {
            case 'error': console.error(consoleMsg); break;
            case 'warning': console.warn(consoleMsg); break;
            case 'success': console.log('%c' + consoleMsg, 'color: #00ff00'); break;
            default: console.log('%c' + consoleMsg, 'color: #0080ff');
        }
    }
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    new NeonBookmarkletExecutor();
});

// Global utilities
window.NeonBookmarklets = {
    create: function(code, name) {
        const encoded = encodeURIComponent(code);
        return `javascript:(function(){${code}})()`;
    },
    
    inject: function(code) {
        const script = document.createElement('script');
        script.textContent = code;
        document.head.appendChild(script);
        return 'Injected successfully';
    }
};
