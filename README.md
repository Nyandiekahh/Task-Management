# Task Management System

A comprehensive task management system built with React that allows organizations to manage tasks, users, and roles with different permission levels.

## Features

### Authentication & Authorization
- Role-based access control (Admin, Manager, User)
- Secure login system
- Protected routes
- Permission-based feature access

### User Management
- User creation and management
- Role assignment
- User status management (Active/Inactive)
- User profile management

### Task Management
- Create and assign tasks
- Task delegation
- Priority levels (High, Medium, Low)
- Task status tracking (Pending, In Progress, Completed)
- Task filtering and sorting

### Role Management
- Customizable roles and permissions
- Role-based access control
- Permission management
- Role assignment to users

### Dashboard
- Task statistics
- User activity tracking
- Online users monitoring
- Task completion metrics

### Activity Logging
- User action tracking
- Task status changes
- Task assignments and delegations
- System-wide activity monitoring

## Tech Stack

- **Frontend:** React.js
- **State Management:** React Context API
- **Routing:** React Router v6
- **Styling:** CSS3 with modern features
- **Authentication:** Custom JWT implementation (mock for development)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm/yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd task-management-system

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm start
```

The application will start running at `http://localhost:3000`

### Default Login Credentials

```plaintext
Admin User:
- Username: admin
- Password: admin123

Manager User:
- Username: manager
- Password: manager123

Regular User:
- Username: user
- Password: user123
```

## Project Structure

```
task-management-system/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
├── public/
└── package.json
```

### Key Directories

- `components/`: Reusable UI components
- `contexts/`: React Context providers
- `hooks/`: Custom React hooks
- `layouts/`: Page layout components
- `pages/`: Main page components
- `services/`: API and service integrations
- `styles/`: CSS styles
- `utils/`: Utility functions and helpers

## Features in Detail

### User Roles

1. **Admin**
   - Full system access
   - User management
   - Role management
   - System settings

2. **Manager**
   - Task creation and assignment
   - Task delegation
   - Report viewing
   - Team management

3. **User**
   - Task viewing and updating
   - Basic task operations
   - Profile management

### Task Management

- Create new tasks
- Assign tasks to users
- Set task priorities
- Update task status
- Task delegation
- Task filtering and search
- Task analytics

### Dashboard Features

- Task statistics
- User activity tracking
- Online user monitoring
- Recent activities
- Performance metrics

## Contributing

Guidelines for contributing to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Task comments and attachments
- [ ] Advanced reporting
- [ ] Team management
- [ ] Project management features
- [ ] Mobile responsive design
- [ ] Dark mode support

## License

This project is licensed under the MIT License - see the LICENSE file for details.# Task-Management
