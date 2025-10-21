# Social Media App (Twitter Clone)

A full-stack Twitter-like social media application built with modern web technologies and comprehensive observability.

## 📖 Overview

This is a production-ready social media application that demonstrates best practices in full-stack development, including frontend/backend separation, RESTful API design, comprehensive testing, and enterprise-grade telemetry and observability.

The app simulates a Twitter-like experience where users can:
- View a personalized feed of posts
- Create and view profiles
- Like, comment, and share posts
- View individual post details with comments

## 🏗️ Architecture

```
social_media_app/
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python server
└── TELEMETRY.md       # Comprehensive observability guide
```

### Frontend (Next.js)
- **Framework**: Next.js 15.5 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR for client-side data fetching and caching
- **Error Tracking**: Sentry for production error monitoring
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)

### Backend (FastAPI)
- **Framework**: FastAPI 0.115
- **Language**: Python 3.10+
- **Server**: Uvicorn with hot reload support
- **Validation**: Pydantic v2 for data validation and serialization
- **Testing**: Pytest with coverage reporting
- **Code Quality**: Ruff (linting and formatting)
- **Mocking**: Faker for generating realistic test data

---

## ✨ Features

### User Profiles
- View user profiles with handle, display name, bio, and avatar
- Display user's posts on their profile page
- Profile data includes engagement metrics

### Posts & Feed
- Chronological feed of posts from all users
- Post details include author information, timestamp, and engagement counts
- Individual post view with full comment thread
- Cursor-based pagination for efficient feed loading

### Interactions
- **Like**: Toggle likes on posts with real-time count updates
- **Comment**: Add comments to posts with nested threading
- **Share**: Share posts with automatic share count tracking
- User-specific interaction states (liked/not liked)

### API Endpoints
```
GET  /feed                      # Get paginated feed of posts
GET  /profiles/{profile_id}     # Get user profile and their posts
GET  /posts/{post_id}           # Get post details with comments
POST /posts/{post_id}/like      # Like/unlike a post
POST /posts/{post_id}/comment   # Add a comment to a post
POST /posts/{post_id}/share     # Share a post
GET  /healthz                   # Health check endpoint
GET  /metrics                   # Prometheus metrics endpoint
```

## 📊 Telemetry & Observability

This application includes enterprise-grade observability with four integrated monitoring systems:

### 🎯 Sentry (Frontend Error Tracking)
- **Purpose**: Capture JavaScript errors, exceptions, and performance issues
- **Scope**: Next.js frontend (client and server-side)
- **Access**: https://sentry.io
- **Integration**: Pre-configured in `sentry.client.config.ts` and `sentry.server.config.ts`

**What it tracks:**
- Real-time JavaScript errors and stack traces
- User impact and affected browser/OS combinations
- Frontend performance metrics (page load times, API calls)
- Error frequency and trends

### 📈 Prometheus (Metrics Collection)
- **Purpose**: Collect time-series metrics about backend performance
- **Scope**: FastAPI backend
- **Access**: http://localhost:9090
- **Metrics Endpoint**: http://localhost:8000/metrics

**What it tracks:**
- HTTP request counts and rates
- Response time percentiles (p50, p95, p99)
- Error rates by status code
- CPU and memory usage
- Concurrent request counts

### 🔍 OpenTelemetry (Distributed Tracing)
- **Purpose**: Trace requests through the system to identify bottlenecks
- **Scope**: FastAPI backend
- **Exporter**: OTLP (can be visualized with Jaeger/Zipkin)

**What it tracks:**
- Request flow and execution path
- Time spent in each function/operation
- Database query performance
- External API call latency
- Error propagation and root causes

### 📊 Grafana (Visualization)
- **Purpose**: Create dashboards and visualize Prometheus metrics
- **Scope**: Backend metrics visualization
- **Access**: http://localhost:3000
- **Default credentials**: admin/admin

**What it provides:**
- Real-time performance dashboards
- Customizable alerts and notifications
- Trend analysis and capacity planning
- Historical data visualization

### Quick Start Telemetry

```bash
# Start all telemetry services
cd backend
docker compose up -d

# Access:
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
# - OTEL Collector: http://localhost:4318
```

For detailed setup instructions, troubleshooting, and best practices, see [`TELEMETRY.md`](./TELEMETRY.md).

---

## 🚀 Getting Started

### Prerequisites

- **Frontend**: Node.js 20+ and npm
- **Backend**: Python 3.10+ and uv (or pip)
- **Telemetry** (optional): Docker and Docker Compose

### Installation

#### 1. Clone the Repository

```bash
cd social_media_lurkers/social_media_app
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment and install dependencies
uv venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .[dev]

# Run the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file for Sentry (optional)
echo "NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here" > .env.local

# Run the development server
npm run dev
```

Frontend will be available at: http://localhost:3000

#### 4. Setup Telemetry (Optional)

```bash
cd backend

# Start all telemetry services
docker compose up -d

# Verify services are running
docker compose ps
```

**Access telemetry dashboards:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- Backend metrics: http://localhost:8000/metrics

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
source .venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_feed.py
```

**Test Coverage:**
- Feed endpoint pagination and data validation
- Profile retrieval and post filtering
- Post interactions (like, comment, share)
- Error handling and edge cases

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

---

## 🔧 Development

### Backend Development

```bash
cd backend

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Lint code
ruff check .

# Format code
ruff format .

# Run type checking
mypy app/
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Lint code
npm run lint

# Format code
npx prettier --write "src/**/*.{ts,tsx}"

# Type checking (automatically happens during build)
npm run build
```

### Code Quality Tools

**Backend:**
- Ruff for linting and formatting (configured in `ruff.toml`)
- Pytest for unit and integration testing
- Line length: 100 characters

**Frontend:**
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- Husky for pre-commit hooks (auto-format and lint)
- Lint-staged for efficient pre-commit checks

---

## 🐳 Docker Deployment

### Backend Docker

```bash
cd backend

# Build image
docker build -t social-media-backend .

# Run container
docker run -p 8000:8000 social-media-backend
```

### Full Stack with Docker Compose

```bash
cd backend

# Start all services (backend + telemetry)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

**Services included:**
- FastAPI backend (port 8000)
- Prometheus (port 9090)
- Grafana (port 3000)
- OpenTelemetry Collector (port 4318)

---

## 📊 API Documentation

### Interactive API Docs

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Example API Calls

```bash
# Get feed
curl http://localhost:8000/feed

# Get profile
curl http://localhost:8000/profiles/user_123

# Get post with comments
curl http://localhost:8000/posts/post_456

# Like a post
curl -X POST http://localhost:8000/posts/post_456/like \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_123"}'

# Add a comment
curl -X POST http://localhost:8000/posts/post_456/comment \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_123", "text": "Great post!"}'

# Health check
curl http://localhost:8000/healthz
```

---

## 🔍 Monitoring & Debugging

### Check Backend Health

```bash
# Health endpoint
curl http://localhost:8000/healthz

# Metrics endpoint (Prometheus format)
curl http://localhost:8000/metrics
```

### View Logs

```bash
# Backend logs (if running with uvicorn)
# Logs appear in terminal

# Docker Compose logs
cd backend
docker compose logs -f

# Specific service logs
docker compose logs -f prometheus
docker compose logs -f grafana
```

### Debugging with Telemetry

1. **Frontend Errors**: Check Sentry dashboard for JavaScript exceptions
2. **Slow Requests**: Use Prometheus to identify high-latency endpoints
3. **Bottlenecks**: Use OpenTelemetry traces to pinpoint slow functions
4. **System Health**: Use Grafana dashboards for real-time monitoring

See [`TELEMETRY.md`](./TELEMETRY.md) for detailed debugging workflows.

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes with appropriate tests
3. Run linters and tests locally
4. Commit (pre-commit hooks will run automatically on frontend)
5. Push and create a pull request

### Code Style

- **Python**: Follow PEP 8, enforced by Ruff (max line length: 100)
- **TypeScript**: Follow ESLint rules, formatted with Prettier
- **Commits**: Use conventional commit messages

---

## 📄 License

This project is part of the Social Media Lurkers learning project.

---

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
uv pip install -e .[dev]

# Check port availability
lsof -i :8000
```

### Frontend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port availability
lsof -i :3000
```

### CORS errors

The backend is configured to allow all origins (`allow_origins=["*"]`). For production, update `app/main.py` to specify allowed origins:

```python
allow_origins=["https://yourdomain.com"]
```

### Telemetry not working

```bash
# Verify Docker services are running
docker compose ps

# Restart telemetry stack
docker compose down && docker compose up -d

# Check OTEL environment variable
echo $OTEL_EXPORTER_OTLP_ENDPOINT
```

For more troubleshooting, see [`TELEMETRY.md`](./TELEMETRY.md).

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Sentry Documentation](https://docs.sentry.io/)

---

**Built with ❤️ as part of the Social Media Lurkers project**
