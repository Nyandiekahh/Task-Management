// Mock tasks data
let tasks = [
    {
        id: 1,
        title: 'Review Q4 Reports',
        assignedBy: 'admin',
        assignedTo: 'user',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-12-20',
        description: 'Review and approve Q4 financial reports',
        createdAt: '2024-11-01'
    },
    {
        id: 2,
        title: 'Update Security Protocols',
        assignedBy: 'admin',
        assignedTo: 'user',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2024-12-15',
        description: 'Review and update company security protocols',
        createdAt: '2024-11-02'
    },
    {
        id: 3,
        title: 'Prepare Monthly Report',
        assignedBy: 'admin',
        assignedTo: 'user',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-11-30',
        description: 'Compile and prepare monthly department report',
        createdAt: '2024-11-03'
    }
];

// Mock activities
let activities = [
    {
        id: 1,
        type: 'task_created',
        user: 'admin',
        action: 'created task',
        taskTitle: 'Review Q4 Reports',
        timestamp: '2024-11-01T10:30:00'
    },
    {
        id: 2,
        type: 'task_assigned',
        user: 'admin',
        action: 'assigned task to',
        target: 'user',
        taskTitle: 'Update Security Protocols',
        timestamp: '2024-11-01T11:15:00'
    }
];

let isInitialized = false;

const initializeService = () => {
    if (isInitialized) return;
    isInitialized = true;
};

const addActivity = (activity) => {
    const newActivity = {
        id: activities.length + 1,
        timestamp: new Date().toISOString(),
        ...activity
    };
    activities.unshift(newActivity);
    return newActivity;
};

export const taskService = {
    getTasks: async () => {
        try {
            initializeService();
            await new Promise(resolve => setTimeout(resolve, 500));
            return [...tasks];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    },

    getTaskById: async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) throw new Error('Task not found');
            return { ...task };
        } catch (error) {
            console.error('Error fetching task:', error);
            throw new Error('Failed to fetch task');
        }
    },

    createTask: async (taskData) => {
        try {
            const newTask = {
                id: tasks.length + 1,
                status: 'pending',
                createdAt: new Date().toISOString(),
                ...taskData
            };
            tasks.push(newTask);

            addActivity({
                type: 'task_created',
                user: taskData.assignedBy,
                action: 'created task',
                taskTitle: taskData.title
            });

            return { ...newTask };
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }
    },

    updateTaskStatus: async (taskId, status) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) throw new Error('Task not found');
            
            task.status = status;
            
            addActivity({
                type: 'task_updated',
                user: task.assignedTo,
                action: `marked task as ${status}`,
                taskTitle: task.title
            });

            return { ...task };
        } catch (error) {
            console.error('Error updating task status:', error);
            throw new Error('Failed to update task status');
        }
    },

    getActivities: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [...activities];
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw new Error('Failed to fetch activities');
        }
    },

    getTaskStats: async (userId = null) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            let userTasks = userId 
                ? tasks.filter(t => t.assignedTo === userId || t.assignedBy === userId)
                : tasks;

            return {
                total: userTasks.length,
                pending: userTasks.filter(t => t.status === 'pending').length,
                inProgress: userTasks.filter(t => t.status === 'in_progress').length,
                completed: userTasks.filter(t => t.status === 'completed').length,
                highPriority: userTasks.filter(t => t.priority === 'high').length,
                mediumPriority: userTasks.filter(t => t.priority === 'medium').length,
                lowPriority: userTasks.filter(t => t.priority === 'low').length,
            };
        } catch (error) {
            console.error('Error fetching task stats:', error);
            throw new Error('Failed to fetch task statistics');
        }
    },

    deleteTask: async (taskId) => {
        try {
            const index = tasks.findIndex(t => t.id === taskId);
            if (index === -1) throw new Error('Task not found');

            const deletedTask = tasks[index];
            tasks.splice(index, 1);

            addActivity({
                type: 'task_deleted',
                user: deletedTask.assignedBy,
                action: 'deleted task',
                taskTitle: deletedTask.title
            });

            return deletedTask;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw new Error('Failed to delete task');
        }
    }
};