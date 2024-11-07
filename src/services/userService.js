// Mock users data
const users = [
    {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        role: 'admin',
        status: 'online',
        lastActive: new Date().toISOString(),
        avatar: 'A'
    },
    {
        id: 2,
        username: 'user',
        name: 'Regular User',
        role: 'user',
        status: 'online',
        lastActive: new Date().toISOString(),
        avatar: 'R'
    },
    {
        id: 3,
        username: 'manager',
        name: 'John Doe',
        role: 'manager',
        status: 'offline',
        lastActive: '2024-11-05T10:30:00',
        avatar: 'J'
    }
];

export const userService = {
    getOnlineUsers: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return users;
        } catch (error) {
            console.error('Error fetching online users:', error);
            throw new Error('Failed to fetch online users');
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            const user = users.find(u => u.id === userId);
            if (user) {
                user.status = status;
                user.lastActive = new Date().toISOString();
            }
            return user;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw new Error('Failed to update user status');
        }
    },

    getUserStats: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                total: users.length,
                online: users.filter(u => u.status === 'online').length,
                offline: users.filter(u => u.status === 'offline').length,
                byRole: {
                    admin: users.filter(u => u.role === 'admin').length,
                    user: users.filter(u => u.role === 'user').length,
                    manager: users.filter(u => u.role === 'manager').length
                }
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw new Error('Failed to fetch user statistics');
        }
    },

    getUserByUsername: async (username) => {
        try {
            const user = users.find(u => u.username === username);
            if (!user) throw new Error('User not found');
            return { ...user };
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    },

    updateUserProfile: async (userId, updates) => {
        try {
            const user = users.find(u => u.id === userId);
            if (!user) throw new Error('User not found');
            Object.assign(user, updates);
            return { ...user };
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }
};