/**
 * notifications.js
 * Toast Notification System for EduMaster
 */

class NotificationSystem {
    constructor() {
        this.createContainer();
    }

    createContainer() {
        if ($('#notification-container').length === 0) {
            $('body').append(`
                <div id="notification-container" class="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
                </div>
            `);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const colors = {
            success: 'bg-emerald-500',
            error: 'bg-red-500',
            warning: 'bg-amber-500',
            info: 'bg-blue-500'
        };

        const id = 'notif-' + Date.now();

        const notification = $(`
            <div id="${id}" class="transform translate-x-full transition-all duration-300 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden">
                <div class="flex items-center gap-3 p-4">
                    <div class="${colors[type]} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <i class="fas ${icons[type]}"></i>
                    </div>
                    <p class="text-sm font-medium text-slate-700 flex-1">${message}</p>
                    <button onclick="window.notifications.close('${id}')" class="text-slate-400 hover:text-slate-600 transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="h-1 ${colors[type]} notification-progress"></div>
            </div>
        `);

        $('#notification-container').append(notification);

        // Trigger animation
        setTimeout(() => {
            $(`#${id}`).removeClass('translate-x-full').addClass('translate-x-0');
        }, 10);

        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                this.close(id);
            }, duration);
        }

        return id;
    }

    close(id) {
        const $notif = $(`#${id}`);
        $notif.addClass('translate-x-full opacity-0');
        setTimeout(() => {
            $notif.remove();
        }, 300);
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Global instance
window.notifications = new NotificationSystem();
