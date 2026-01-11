/**
 * utils.js
 * Utility functions for pagination, sorting, and export
 */

// Pagination Helper
class Pagination {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    get totalPages() {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    get currentItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }

    prevPage() {
        return this.goToPage(this.currentPage - 1);
    }
}

// Sorting Helper
function sortData(data, key, direction = 'asc') {
    return [...data].sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        // Handle nested properties (e.g., 'user.name')
        if (key.includes('.')) {
            const keys = key.split('.');
            aVal = keys.reduce((obj, k) => obj?.[k], a);
            bVal = keys.reduce((obj, k) => obj?.[k], b);
        }

        // Convert to lowercase for string comparison
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// CSV Export Helper
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];

            // Handle objects and arrays
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }

            // Escape quotes and wrap in quotes if contains comma
            value = String(value).replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n')) {
                value = `"${value}"`;
            }

            return value;
        });
        csv += values.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show notification
    if (window.notifications) {
        window.notifications.success(`Fichier ${filename} téléchargé`);
    }
}

// Render Pagination Controls
function renderPaginationControls(pagination, containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { currentPage, totalPages } = pagination;

    let html = `
        <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div class="text-sm text-slate-600">
                Page <span class="font-bold">${currentPage}</span> sur <span class="font-bold">${totalPages}</span>
                <span class="ml-4 text-slate-400">Total: ${pagination.items.length} éléments</span>
            </div>
            <div class="flex gap-2">
                <button 
                    onclick="window.paginationPrev()" 
                    ${currentPage === 1 ? 'disabled' : ''}
                    class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <i class="fas fa-chevron-left"></i>
                </button>
    `;

    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button 
                onclick="window.paginationGoTo(${i})"
                class="px-4 py-2 rounded-lg border ${i === currentPage
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-200 text-slate-600 hover:bg-white'} transition">
                ${i}
            </button>
        `;
    }

    html += `
                <button 
                    onclick="window.paginationNext()" 
                    ${currentPage === totalPages ? 'disabled' : ''}
                    class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Set global functions for pagination
    window.paginationNext = () => {
        if (pagination.nextPage()) {
            onPageChange();
        }
    };

    window.paginationPrev = () => {
        if (pagination.prevPage()) {
            onPageChange();
        }
    };

    window.paginationGoTo = (page) => {
        if (pagination.goToPage(page)) {
            onPageChange();
        }
    };
}

// Make functions globally available
window.Pagination = Pagination;
window.sortData = sortData;
window.exportToCSV = exportToCSV;
window.renderPaginationControls = renderPaginationControls;
