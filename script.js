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

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.sidebarOpen && 
                !document.getElementById('sidebar').contains(e.target) && 
                e.target.id !== 'sidebarToggle') {
                this.toggleSidebar();
            }
        });

        // ... rest of your existing event bindings ...
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        document.getElementById('sidebar').classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('sidebar-open');
        
        if (this.sidebarOpen) {
            this.log('Sidebar opened', 'info');
        } else {
            this.log('Sidebar closed', 'info');
        }
    }

    // ... rest of your existing methods ...
}
