/**
 * data.js
 * Simulated Backend using localStorage
 * Handles Users, Courses, Modules, Resources, Enrollments
 */

const SEED_DATA = {
    users: [
        {
            id: 1,
            email: "superadmin@test.com",
            password: "password123", // In real app, this would be hashed
            firstname: "Super",
            lastname: "Admin",
            role: "ROLE_SUPER_ADMIN",
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            email: "admin@test.com",
            password: "password123",
            firstname: "Admin",
            lastname: "User",
            role: "ROLE_ADMIN",
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            email: "teacher@test.com",
            password: "password123",
            firstname: "Prof",
            lastname: "Tournesol",
            role: "ROLE_TEACHER",
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            email: "student@test.com",
            password: "password123",
            firstname: "Alice",
            lastname: "Etudiante",
            role: "ROLE_STUDENT",
            isActive: true,
            createdAt: new Date().toISOString()
        }
    ],
    courses: [
        {
            id: 1,
            title: "Introduction au JavaScript",
            description: "Apprenez les bases du langage web le plus populaire.",
            codeUnique: "JS101",
            teacherId: 3,
            createdAt: new Date().toISOString(),
            modules: []
        },
        {
            id: 2,
            title: "Mathématiques Avancées",
            description: "Cours complet sur l'algèbre et l'analyse.",
            codeUnique: "MATH202",
            teacherId: 3,
            createdAt: new Date().toISOString(),
            modules: []
        }
    ],
    enrollments: [] // { userId, courseId, enrolledAt }
};

class DataStore {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('mini_lms_users')) {
            console.log("Initializing Seed Data...");
            this.save('users', SEED_DATA.users);
            this.save('courses', SEED_DATA.courses);
            this.save('enrollments', SEED_DATA.enrollments);
        } else {
            // ROBUST BACKWARDS COMPATIBILITY FIX:
            let users = this.getAll('users');

            // 1. Remove potential duplicates of Super Admin if any (keep the one with correct role if possible)
            // We want ONE Super Admin with email superadmin@test.com
            const superAdminIndex = users.findIndex(u => u.email === 'superadmin@test.com');

            if (superAdminIndex !== -1) {
                // User exists with this email. Force role to be correct.
                users[superAdminIndex].role = 'ROLE_SUPER_ADMIN';
                users[superAdminIndex].isActive = true; // Ensure active

                // Remove any OTHER super admins if they exist by mistake
                users = users.filter((u, idx) => idx === superAdminIndex || u.role !== 'ROLE_SUPER_ADMIN');
            } else {
                // User doesn't exist. Create it.
                // Find max ID
                const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
                const newSuperAdmin = { ...SEED_DATA.users[0] };
                newSuperAdmin.id = maxId + 1;
                newSuperAdmin.role = 'ROLE_SUPER_ADMIN'; // Ensure role
                users.unshift(newSuperAdmin);
            }

            // 2. Remove any accidentally duplicated users with same ID
            const seenIds = new Set();
            users = users.filter(u => {
                if (seenIds.has(u.id)) return false;
                seenIds.add(u.id);
                return true;
            });

            this.save('users', users);
        }
    }

    // Generic Load
    getAll(entity) {
        const data = localStorage.getItem(`mini_lms_${entity}`);
        return data ? JSON.parse(data) : [];
    }

    getById(entity, id) {
        const items = this.getAll(entity);
        return items.find(item => item.id == id);
    }

    // Generic Save
    save(entity, data) {
        localStorage.setItem(`mini_lms_${entity}`, JSON.stringify(data));
    }

    // CRUD: Create (Add)
    add(entity, item) {
        const items = this.getAll(entity);
        // Auto-increment ID
        const maxId = items.reduce((max, current) => (current.id > max ? current.id : max), 0);
        item.id = maxId + 1;
        item.createdAt = new Date().toISOString();

        items.push(item);
        this.save(entity, items);
        return item;
    }

    // CRUD: Update
    update(entity, id, updatedFields) {
        const items = this.getAll(entity);
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedFields };
            this.save(entity, items);
            return items[index];
        }
        return null;
    }

    // CRUD: Delete
    delete(entity, id) {
        let items = this.getAll(entity);
        items = items.filter(item => item.id != id);
        this.save(entity, items);
    }

    // RELATIONSHIPS
    getCoursesByTeacher(teacherId) {
        const courses = this.getAll('courses');
        return courses.filter(course => course.teacherId == teacherId);
    }

    getEnrollmentsByStudent(studentId) {
        return this.getAll('enrollments').filter(e => e.userId == studentId);
    }

    // Auth specific
    findUserByEmail(email) {
        const users = this.getAll('users');
        return users.find(u => u.email === email);
    }
}

// Global Instance
window.db = new DataStore();
