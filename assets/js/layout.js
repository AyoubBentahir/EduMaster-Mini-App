/**
 * layout.js
 * Handles Sidebar generation and common layout tasks.
 * usage: Layout.init('active-page-name');
 */

const Layout = {
    appName: 'EduMaster', // New Brand Name

    init: function (activePage) {
        this.renderSidebar(activePage);
        this.renderUserDropdown();
        this.checkAuth();
        this.fixRelativeLinks();
    },

    checkAuth: function () {
        if (!window.auth.isAuthenticated()) {
            // Determine depth to find index.html
            // If we are in pages/teacher/dashboard.html -> ../../index.html
            // If we are in index.html -> nothing.
            const path = window.location.pathname;
            if (!path.endsWith('index.html') && !path.endsWith('/')) {
                // specific logic can be added if needed, but usually auth.js handles redirect
                // window.location.href = '../../index.html'; 
                // We leave strict redirect to individual pages or auth.js to avoid loops
            }
        }
    },

    // Helper to get correct relative path to root based on current location
    getRootPath: function () {
        const path = window.location.pathname;
        if (path.includes('/pages/teacher/') || path.includes('/pages/student/') || path.includes('/pages/admin/') || path.includes('/pages/common/')) {
            return '../../';
        }
        return '';
    },

    renderSidebar: function (activePage) {
        const user = window.auth.currentUser;
        if (!user) return;

        const role = user.role;
        const root = this.getRootPath();

        let menuItems = [];

        // Define Menu Items based on Role (Using relative paths from the specific role directory is tricky if we reuse this across different folders)
        // STRATEGY: Always use paths relative to the PAGE using this script.
        // But better: Use strict paths assuming standard structure.

        // We need to know "Are we in pages/teacher/?" 
        // to link to "../admin/dashboard.html" vs "dashboard.html"

        // Simpler approach: All links in Sidebar are defined relative to the pages/* depth
        // We assume all 'dashboard' pages are 1 folder deep inside 'pages/' (e.g. pages/teacher/x.html)
        // EXCEPT if we are in 'pages/common/profile.html'

        const inCommon = window.location.pathname.includes('/pages/common/');
        const prefix = inCommon ? '../' : '../'; // From pages/common/ -> goes to pages/

        // Actually, let's normalize everything to be from 'pages/' root if possible, or relative to current.
        // Let's use standard relative paths assuming we are in pages/{role}/

        if (role === 'ROLE_SUPER_ADMIN') {
            menuItems = [
                { id: 'dashboard', icon: 'fa-chart-pie', label: 'Tableau de Bord', link: '../admin/dashboard.html' },
                { id: 'users', icon: 'fa-users-cog', label: 'Utilisateurs', link: '../admin/users.html' },
                { id: 'profile', icon: 'fa-user-circle', label: 'Mon Profil', link: '../common/profile.html' }
            ];
        } else if (role === 'ROLE_ADMIN') {
            menuItems = [
                { id: 'dashboard', icon: 'fa-chart-pie', label: 'Tableau de Bord', link: '../admin/dashboard.html' },
                { id: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Enseignants', link: '../admin/users.html?role=ROLE_TEACHER' },
                { id: 'students', icon: 'fa-user-graduate', label: 'Étudiants', link: '../admin/users.html?role=ROLE_STUDENT' }, // Point to users.html with filter
                { id: 'profile', icon: 'fa-user-circle', label: 'Mon Profil', link: '../common/profile.html' }
            ];
        } else if (role === 'ROLE_TEACHER') {
            menuItems = [
                { id: 'dashboard', icon: 'fa-home', label: 'Accueil', link: '../teacher/dashboard.html' },
                { id: 'courses', icon: 'fa-chalkboard', label: 'Mes Cours', link: '../teacher/courses.html' },
                // Removed non-existent Modules page
                { id: 'profile', icon: 'fa-user-circle', label: 'Mon Profil', link: '../common/profile.html' }
            ];
        } else if (role === 'ROLE_STUDENT') {
            menuItems = [
                { id: 'dashboard', icon: 'fa-home', label: 'Accueil', link: '../student/dashboard.html' },
                { id: 'my-courses', icon: 'fa-graduation-cap', label: 'Mes Cours', link: '../student/my-courses.html' },
                { id: 'catalogue', icon: 'fa-search', label: 'Catalogue', link: '../student/catalogue.html' },
                { id: 'profile', icon: 'fa-user-circle', label: 'Mon Profil', link: '../common/profile.html' }
            ];
        }

        // Generate HTML
        let html = `
            <div class="sidebar-logo p-6 mb-6 flex items-center justify-center border-b border-white/10">
                <div class="text-center">
                    <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-2 mx-auto shadow-lg shadow-indigo-500/50">
                        <i class="fas fa-shapes"></i>
                    </div>
                    <span class="text-xl font-bold tracking-tight text-white">${this.appName}</span>
                </div>
            </div>
            <nav class="sidebar-menu flex flex-col gap-2 px-4">
        `;

        menuItems.forEach(item => {
            // Fix active state logic
            const isActive = item.id === activePage ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5';

            html += `
                <a href="${item.link}" class="nav-item flex items-center p-3 rounded-lg transition-all duration-200 ${isActive}">
                    <i class="fas ${item.icon} w-8 text-center"></i>
                    <span class="font-medium text-sm">${item.label}</span>
                </a>
            `;
        });

        html += `
            </nav>
            <div class="mt-auto p-4 border-t border-white/10">
                <a href="#" onclick="window.auth.logout()" class="nav-item flex items-center p-3 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all">
                    <i class="fas fa-sign-out-alt w-8 text-center"></i>
                    <span class="font-medium text-sm">Déconnexion</span>
                </a>
            </div>
        `;

        const sidebar = $('#sidebar');
        if (sidebar.length) {
            sidebar.html(html);
            sidebar.addClass('bg-slate-900 text-white w-64 h-full fixed left-0 top-0 flex flex-col shadow-2xl z-50');
        }
    },

    renderUserDropdown: function () {
        const user = window.auth.currentUser;
        if (!user) return;

        $('#current-user-name').text(`${user.firstname} ${user.lastname}`);
        $('#current-user-role').text(this.getRoleLabel(user.role));
    },

    getRoleLabel: function (role) {
        const map = {
            'ROLE_SUPER_ADMIN': 'Direction',
            'ROLE_ADMIN': 'Administrateur',
            'ROLE_TEACHER': 'Professeur',
            'ROLE_STUDENT': 'Étudiant'
        };
        return map[role] || role;
    },

    // Attempt to fix links if we are deeper in structure (e.g. details pages)
    fixRelativeLinks: function () {
        // This is a simple placeholder. 
        // In a real static site without a bundler, relative paths are hard.
        // We assume flat structure inside 'pages/role/' for simplified logic.
    }
};
