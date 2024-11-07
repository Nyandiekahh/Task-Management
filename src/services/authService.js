import { v4 as uuidv4 } from 'uuid'; // You'll need to install this: npm install uuid

// Mock user data with roles and permissions
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        permissions: ['all'],
        email: 'admin@example.com'
    },
    {
        id: 2,
        username: 'manager',
        password: 'manager123',
        name: 'Manager User',
        role: 'manager',
        permissions: ['create_task', 'edit_task', 'assign_task', 'view_all_tasks', 'view_reports'],
        email: 'manager@example.com'
    },
    {
        id: 3,
        username: 'user',
        password: 'user123',
        name: 'Regular User',
        role: 'user',
        permissions: ['create_task', 'edit_task'],
        email: 'user@example.com'
    }
];

export const authService = {
    login: async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = users.find(
            u => u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
            const { password, ...userWithoutPassword } = user;
            // Generate a mock token
            const token = uuidv4();
            
            return {
                userData: userWithoutPassword,
                token: token
            };
        }
        throw new Error('Invalid credentials');
    },

    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, you would invalidate the token on the server
    },

    getUserDetails: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        
        const { password, ...userDetails } = user;
        return userDetails;
    },

    // Verify token validity (mock implementation)
    verifyToken: async (token) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true; // In a real app, you would verify the token with your backend
    },

    // Refresh token (mock implementation)
    refreshToken: async (refreshToken) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            token: uuidv4(),
            refreshToken: uuidv4()
        };
    }
};