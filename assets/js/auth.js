/**
 * auth.js
 * Handles Authentication and Session Management
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    login(email, password) {
        const user = window.db.findUserByEmail(email);

        if (user && user.password === password) { // Simple check, no hash for mock
            if (!user.isActive) {
                return { success: false, message: "Ce compte a été désactivé." };
            }
            this.setSession(user);
            return { success: true, user: user };
        }
        return { success: false, message: "Identifiants invalides." };
    }

    logout() {
        localStorage.removeItem('mini_lms_current_user');
        this.currentUser = null;
        window.location.href = '../../index.html';
    }

    setSession(user) {
        // Don't store password in session
        const safeUser = { ...user };
        delete safeUser.password;

        localStorage.setItem('mini_lms_current_user', JSON.stringify(safeUser));
        this.currentUser = safeUser;
    }

    loadSession() {
        const stored = localStorage.getItem('mini_lms_current_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    requireRole(role) {
        if (!this.isAuthenticated()) {
            window.location.href = '../../index.html';
            return false;
        }

        // Simple hierarchy check could be added here
        if (this.currentUser.role !== role && this.currentUser.role !== 'ROLE_SUPER_ADMIN') {
            // Allow Super Admin everywhere or restrict strictly?
            // For strict MVC mimic:
            if (this.currentUser.role !== role) {
                alert("Accès non autorisé.");
                window.history.back();
                return false;
            }
        }
        return true;
    }

    // Redirect to appropriate dashboard based on role
    getDashboardUrl(role) {
        switch (role) {
            case 'ROLE_SUPER_ADMIN': return 'pages/admin/dashboard.html'; // Super Admin shares admin area or has specific?
            case 'ROLE_ADMIN': return 'pages/admin/dashboard.html';
            case 'ROLE_TEACHER': return 'pages/teacher/dashboard.html';
            case 'ROLE_STUDENT': return 'pages/student/dashboard.html';
            default: return 'index.html';
        }
    }
}

window.auth = new AuthService();
