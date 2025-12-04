document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const userRaw = localStorage.getItem('user_data');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Optional: role-based frontend guard by URL path
    const path = window.location.pathname || '';
    const role = user.role;

    const roleAllowed = () => {
        if (path.includes('/dashboard/admin')) {
            return role === 'admin' || role === 'head_teacher';
        }
        if (path.includes('/dashboard/hod')) {
            return role === 'hod';
        }
        if (path.includes('/dashboard/teacher')) {
            return role === 'teacher' || role === 'senior_teacher';
        }
        if (path.includes('/dashboard/student')) {
            return role === 'student';
        }
        // Fallback: allow all roles on generic dashboard.html
        return true;
    };

    if (!roleAllowed()) {
        window.location.href = 'login.html';
    }
});


