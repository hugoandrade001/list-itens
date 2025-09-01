# SharedLists - Real-Time Collaborative Lists Application

A modern, real-time collaborative list management application that allows multiple users to create, edit, and manage shared lists with instant synchronization across all connected clients.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Real-Time Collaboration**: Instant synchronization of changes across all connected users
- **List Management**: Create, edit, and delete shared lists with custom titles and descriptions
- **Item Management**: Add, edit, complete, and remove items from lists in real-time
- **Activity Tracking**: Comprehensive audit trail of all user actions with timestamps
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Live Activity Feed**: Real-time notifications of user actions and changes

## 🛠 Technology Stack

### Backend
- **Node.js** with **TypeScript** - Runtime and type safety
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **Prisma ORM** - Database management and migrations
- **SQLite** - Database (easily configurable for PostgreSQL/MySQL)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with **TypeScript** - Modern UI library with type safety
- **React Hooks** - State management and lifecycle
- **Axios** - HTTP client for API communication
- **Socket.IO Client** - Real-time communication
- **CSS3** - Modern responsive styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## ⚡ Quick Start

### 🚀 Super Simple Setup (Just 2 Commands!)

```bash
# 1. Clone and setup everything automatically
git clone https://github.com/hugoandrade001/list-itens.git
cd list-itens
npm run setup

# 2. Start backend server
npm run dev
```

**That's it! 🎉** The application will be available at `http://localhost:3000`

- Backend runs on `http://localhost:4000
- Database is automatically configured with Prisma + SQLite

### Alternative: Manual Setup

### 1. Clone the repository
```bash
git clone https://github.com/hugoandrade001/list-itens.git
cd list-itens
```

### 2. Install all dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 4. Start the development servers

**Option A: Both servers at once**
```bash
npm run dev:all
```

**Option B: Separate terminals**

Terminal 1 - Backend (port 3001):
```bash
npm run dev
```

Terminal 2 - Frontend (port 3000):
```bash
cd frontend
npm start
```

### 5. Access the application
Open your browser and navigate to `http://localhost:3000`

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | **🎯 One-command setup** - Installs all dependencies and configures database |
| `npm run dev:all` | **🚀 Start everything** - Runs both backend and frontend simultaneously |
| `npm run dev` | Start backend server only (port 3001) |
| `npm run dev:frontend` | Start frontend server only (port 3000) |
| `npm run install:all` | Install dependencies for both backend and frontend |
| `npm run db:setup` | Generate Prisma client and setup database |
| `npm run db:reset` | Reset database (useful for development) |

## 🏗 Project Structure

```
shared-lists/
├── src/                          # Backend source code
│   ├── features/
│   │   ├── user/                 # User authentication
│   │   ├── list/                 # List management
│   │   ├── listItem/             # List item operations
│   │   └── activity/             # Activity logging
│   ├── globals/
│   │   └── middlewares/          # Authentication middleware
│   └── database/                 # Database configuration
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts
│   │   └── services/             # API services
│   └── public/                   # Static assets
├── prisma/                       # Database schema and migrations
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - User login

### Lists
- `GET /api/lists/getAllLists` - Get all lists
- `GET /api/lists/my-lists` - Get user's lists
- `GET /api/lists/list/:id` - Get specific list
- `POST /api/lists/createList` - Create new list
- `PUT /api/lists/update/:id` - Update list
- `DELETE /api/lists/delete/:id` - Delete list

### List Items
- `GET /api/listitems/list/:listId` - Get list items
- `POST /api/listitems/create` - Create new item
- `PUT /api/listitems/update/:id` - Update item
- `DELETE /api/listitems/delete/:id` - Delete item

### Activity
- `GET /api/activity/recent` - Get recent activities
- `GET /api/activity/lists/:listId` - Get list-specific activities
- `GET /api/activity/user` - Get user activities

## 🔄 Real-Time Events

The application uses Socket.IO for real-time communication:

- `listCreated` - New list created
- `listUpdated` - List modified
- `listDeleted` - List removed
- `itemCreated` - New item added
- `itemUpdated` - Item modified
- `itemDeleted` - Item removed
- `newActivity` - Activity log update

## 🗄 Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **List**: Shared lists with metadata
- **ListItem**: Individual items within lists
- **ActivityLog**: Audit trail of all actions

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

## 🚀 Deployment

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
PORT=3001
NODE_ENV=production
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ..
npm start
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Hugo Andrade** - [GitHub](https://github.com/hugoandrade001)

## 🤝 Support

If you have any questions or need help with setup, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using modern web technologies for seamless real-time collaboration.
