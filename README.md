# Quark Chat - Next-Generation Messaging Platform

A real-time chat application built with Node.js, Express, Socket.IO, and PostgreSQL. Features modern UI with end-to-end encryption, group chats, and AI-powered suggestions.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery with Socket.IO
- **User Authentication**: Secure authentication with Clerk
- **Group & Direct Chats**: Support for both individual and group conversations
- **Modern UI**: Responsive design with emoji picker and file attachments
- **Database**: PostgreSQL with Prisma ORM
- **Docker Support**: Complete containerized development environment

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Frontend**: EJS templates with vanilla JavaScript
- **Styling**: CSS3 with modern design
- **Infrastructure**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (>= 18.17.0)
- Docker & Docker Compose
- npm or yarn

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/lwshakib/quark-chat-chatting-webapp.git
   cd quark-chat-chatting-webapp
   ```

2. **Start the infrastructure**

   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**

   ```bash
   npm run migrate:dev
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
quark-chat/
├── controllers/          # Route controllers
├── generated/           # Prisma generated files
├── lib/                 # Database connection
├── prisma/             # Database schema
├── public/             # Static assets
│   ├── scripts/        # Client-side JavaScript
│   └── styles/         # CSS files
├── routes/             # Express routes
├── views/              # EJS templates
├── docker-compose.yml  # Infrastructure setup
└── index.js           # Application entry point
```

## 🗄️ Database Schema

- **Users**: User accounts and profiles
- **Chats**: Direct and group conversations
- **Messages**: Individual messages with sender and chat associations

## 🐳 Docker Services

- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Kafka**: Message queuing (for future scaling)
- **pgAdmin**: Database management interface

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run generate` - Generate Prisma client
- `npm run migrate:dev` - Run database migrations
- `npm run studio` - Open Prisma Studio

## 🔧 Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
CLERK_SECRET_KEY="your_clerk_secret"
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
PORT=3000
```

## 🌐 API Endpoints

- `GET /` - Landing page
- `GET /chats` - Chat interface
- WebSocket connection for real-time messaging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Built with ❤️ using modern web technologies
