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

## Quick Start

### Prerequisites

-   Node.js (v18+)
-   Bun package manager
-   MongoDB Atlas account
-   Groq API key

### Installation & Development

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Mangodesk
    ```

2. **Set up Backend:**

    ```bash
    cd Backend
    bun install
    ```

    Create `.env` file in the `Backend` directory:

    ```env
    MONGO_URI=your_mongodb_connection_string
    GROQ_API_KEY=your_groq_api_key
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    NODE_ENV=development
    ```

3. **Set up Frontend:**

    ```bash
    cd ../Frontend
    bun install
    ```

4. **Start Development Servers:**

    **Backend** (Terminal 1):

    ```bash
    cd Backend
    bun run dev
    ```

    Backend will run on http://localhost:5000

    **Frontend** (Terminal 2):

    ```bash
    cd Frontend
    bun run dev
    ```

    Frontend will run on http://localhost:5173

## API Endpoints

-   `GET /api/health` - Health check
-   `POST /api/summaries` - Generate summary from transcript
-   `GET /api/summaries/:id` - Get specific summary
-   `PUT /api/summaries/:id` - Update summary
-   `POST /api/summaries/:id/share` - Share summary via email
-   `GET /api/summaries` - Get all summaries (paginated)

## Development Scripts

**Backend (cd Backend):**

```bash
bun run dev          # Start backend in development mode
bun run start        # Start backend in production mode
```

**Frontend (cd Frontend):**

```bash
bun run dev          # Start frontend development server
bun run build        # Build frontend for production
bun run preview      # Preview production build
```

**Root directory:**

```bash
bun run clean        # Remove all node_modules directories
```

## Project Structure

```
├── Backend/              # Express.js API server
│   ├── server.js         # Main API server
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

The application uses separate development servers:

-   **Backend**: Runs on port 5000 (API only)
-   **Frontend**: Runs on port 5173 with API proxy to backend

## Deployment

Deploy the Frontend and Backend separately to your preferred platforms (Vercel, Netlify, Heroku, etc.).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
