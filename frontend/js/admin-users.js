// Admin User Management Script
class UserManager {
    constructor() {
        this.apiBase = 'http://localhost:8000';
        this.users = [];
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadUsers();
    }

    attachEventListeners() {
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = 'login.html';
            });
        }

        const searchInput = document.getElementById('searchUsers');
        const roleFilter = document.getElementById('roleFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterUsers());
        }
        
        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.filterUsers());
        }
    }

    async loadUsers() {
        try {
            const response = await fetch(`${this.apiBase}/api/users/list.php`);
            const data = await response.json();
            
            if (data.success) {
                this.users = data.data;
                this.renderUsers(this.users);
            } else {
                throw new Error(data.message || 'Failed to load users');
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            this.renderError();
        }
    }

    filterUsers() {
        const searchTerm = document.getElementById('searchUsers')?.value.toLowerCase() || '';
        const roleFilter = document.getElementById('roleFilter')?.value || '';
        
        const filtered = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                                 user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
        
        this.renderUsers(filtered);
    }

    renderUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center;">No users found.</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr style="border-bottom: 1px solid var(--gray-200);">
                <td style="padding: 0.75rem;">${user.id}</td>
                <td style="padding: 0.75rem;"><strong>${user.name}</strong></td>
                <td style="padding: 0.75rem;">${user.email}</td>
                <td style="padding: 0.75rem;">
                    <span class="badge badge-${this.getRoleBadgeClass(user.role)}">${user.role}</span>
                </td>
                <td style="padding: 0.75rem;">${user.created_at}</td>
                <td style="padding: 0.75rem;">
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="alert('Edit user ${user.id}')">Edit</button>
                    <button class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.875rem; background: var(--error-red); color: white;" onclick="confirmDelete(${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    getRoleBadgeClass(role) {
        const roleMap = {
            'admin': 'primary',
            'teacher': 'success',
            'student': 'easy'
        };
        return roleMap[role] || 'easy';
    }

    renderError() {
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--error-red);">Failed to load users. Please try again.</td></tr>';
        }
    }
}

function showAddUserModal() {
    alert('Add User feature coming soon!');
}

function confirmDelete(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
        alert('Delete functionality coming soon!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserManager();
});
