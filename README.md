# MangoDesk AI Summarizer

AI-Powered Meeting Notes Summarizer - A full-stack MERN application that transforms meeting transcripts into professional summaries with dark mode support and email sharing capabilities.

## Features

-   🤖 **AI-Powered Summarization**: Uses Groq API to generate professional meeting summaries
-   🌙 **Dark Mode Support**: Fully responsive dark/light theme toggle
-   📧 **Email Sharing**: Share summaries via email with clean, professional formatting
-   📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
-   🔄 **Real-time Processing**: Fast transcript processing and summary generation
-   💾 **Data Persistence**: MongoDB storage for all summaries and user data

## Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS 4, React Markdown
-   **Backend**: Node.js, Express.js, MongoDB Atlas
-   **AI Service**: Groq SDK with Llama models
-   **Package Manager**: Bun
-   **Deployment**: Single-command unified development and production setup

## Quick Start

### Prerequisites

-   Node.js (v18+)
-   Bun package manager
-   MongoDB Atlas account
-   Groq API key

### Installation & Development

1. **Clone and install dependencies:**

    ```bash
    git clone <repository-url>
    cd Mangodesk
    bun install
    ```

2. **Set up environment variables:**
   Create `.env` file in the `Backend` directory:

    ```env
    MONGO_URI=your_mongodb_connection_string
    GROQ_API_KEY=your_groq_api_key
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    NODE_ENV=development
    ```

3. **Start development servers:**
    ```bash
    bun run dev
    ```
    This single command starts both frontend (http://localhost:5173+) and backend (http://localhost:5000) with API proxying.

### Production Deployment

1. **Build for production:**

    ```bash
    bun run build
    ```

2. **Start production server:**
    ```bash
    NODE_ENV=production bun run start
    ```
    Serves both frontend and backend on single port (5000) with static file serving.

## API Endpoints

-   `GET /api/health` - Health check
-   `POST /api/summaries` - Generate summary from transcript
-   `GET /api/summaries/:id` - Get specific summary
-   `PUT /api/summaries/:id` - Update summary
-   `POST /api/summaries/:id/share` - Share summary via email
-   `GET /api/summaries` - Get all summaries (paginated)

## Development Scripts

```bash
bun run dev          # Start both frontend and backend in development
bun run build        # Build frontend for production
bun run start        # Start production server
bun run backend:dev  # Start only backend in development
bun run frontend:dev # Start only frontend in development
bun install:all      # Install all dependencies (root, backend, frontend)
bun run clean        # Remove all node_modules directories
```

## Project Structure

```
├── package.json          # Root package.json with unified scripts
├── Backend/              # Express.js API server
│   ├── server.js         # Main server with static file serving
│   ├── controllers/      # API controllers
│   ├── routes/          # API routes
│   ├── models/          # MongoDB models
│   └── services/        # External services (AI, Email)
├── Frontend/            # React application
│   ├── src/
│   │   ├── Components/  # React components
│   │   ├── services/    # API client
│   │   └── assets/      # Static assets
│   └── dist/           # Production build output
```

## Environment Configuration

The application automatically adapts to development vs production environments:

-   **Development**: Frontend runs on separate port with API proxying
-   **Production**: Frontend served as static files from backend on single port

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3.
