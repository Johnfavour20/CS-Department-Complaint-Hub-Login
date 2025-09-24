import { User, UserRole } from '../types';

// A mock database of students
const students: Map<string, Omit<User, 'role' | 'id'>> = new Map([
    ['U2021/5570009', { name: 'Ada Okoro', profilePictureUrl: `https://picsum.photos/seed/${'U2021/5570009'}/200`, department: 'Computer Science', level: 300, email: 'ada.okoro@csd.edu', phone: '08012345678' }],
    ['U2020/5512345', { name: 'Bolanle Adeyemi', profilePictureUrl: `https://picsum.photos/seed/${'U2020/5512345'}/200`, department: 'Petroleum Engineering', level: 400, email: 'bolanle.adeyemi@csd.edu', phone: '08023456789' }],
    ['U2022/5598765', { name: 'Chukwudi Eze', profilePictureUrl: `https://picsum.photos/seed/${'U2022/5598765'}/200`, department: 'Medicine and Surgery', level: 200, email: 'chukwudi.eze@csd.edu', phone: '08034567890' }],
    ['U2019/5545678', { name: 'Fatima Sani', profilePictureUrl: `https://picsum.photos/seed/${'U2019/5545678'}/200`, department: 'Law', level: 500, email: 'fatima.sani@csd.edu', phone: '08045678901' }],
    ['U2021/5570010', { name: 'Emeka Nwosu', profilePictureUrl: `https://picsum.photos/seed/${'U2021/5570010'}/200`, department: 'Electrical Engineering', level: 300, email: 'emeka.nwosu@csd.edu', phone: '08056789012' }],
]);

export const adminUser: User = {
    id: 'admin01',
    name: 'Dr. Amina Bello',
    role: UserRole.ADMIN,
    profilePictureUrl: `https://picsum.photos/seed/admin01/200`,
    department: 'Central Administration',
    email: 'amina.bello@csd.edu',
    phone: '08098765432'
};

export const findStudentById = (id: string): User | null => {
    const studentData = students.get(id);
    if (studentData) {
        return {
            id,
            role: UserRole.STUDENT,
            ...studentData,
        };
    }
    // For new students not in the initial "database" - allows any valid ID format to log in
    if (id.match(/^U\d{4}\/\d{7}$/)) {
        return {
            id,
            name: `Student ${id.slice(-4)}`, // Generate a name
            role: UserRole.STUDENT,
            profilePictureUrl: undefined, // No picture for new students
            department: 'Undeclared',
            level: 100,
            email: `${id.toLowerCase()}@student.csd.edu`,
            phone: 'N/A'
        }
    }
    return null;
};

export const findUserById = (id: string): User | null => {
    if (id === adminUser.id) return adminUser;
    
    const studentData = students.get(id);
     if (studentData) {
        return {
            id,
            role: UserRole.STUDENT,
            ...studentData,
        };
    }

    // Fallback for dynamically created students who might have complaints
    if (id.match(/^U\d{4}\/\d{7}$/)) {
         return {
            id,
            name: `Student ${id.slice(-4)}`,
            role: UserRole.STUDENT,
        }
    }

    return null;
}