# Telemetry & Observability Guide

This document describes the telemetry and observability stack for the Social Media Twitter Clone application. The stack includes **Sentry** (frontend error tracking), **Prometheus** (metrics collection), **OpenTelemetry** (distributed tracing), and **Grafana** (visualization).

---

## 📊 Overview

| Component | Purpose | Scope | Key Questions Answered |
|-----------|---------|-------|----------------------|
| **Sentry** | Error & exception tracking | Frontend (Next.js) | What errors are users experiencing? Where do crashes occur? |
| **Prometheus** | Metrics & time-series data | Backend (FastAPI) | How many requests? How fast? What's the error rate? |
| **OpenTelemetry** | Distributed tracing | Backend (FastAPI) | How long do requests take? Which endpoints are slow? |
| **Grafana** | Visualization & dashboards | Backend metrics | What are the trends? Are there anomalies? |

---

## 🎯 Sentry (Frontend Error Tracking)

### Purpose
Sentry captures JavaScript errors, unhandled exceptions, and performance issues in the Next.js frontend, helping you understand what's breaking for real users.

### Setup

1. **Configure Environment Variables**
   
   Create a `.env.local` file in `frontend/`:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   # Get your DSN from https://sentry.io/settings/northwestern-university-40/projects/social-media-lurkers/keys/
   ```

2. **Sentry is Already Integrated**
   
   The wizard has been pre-configured in:
   - `frontend/src/sentry.client.config.ts` - Client-side error tracking
   - `frontend/src/sentry.server.config.ts` - Server-side error tracking
   - `frontend/next.config.ts` - Build-time configuration

3. **Run the Frontend**
   ```bash
   cd frontend
   npm run dev
   # or for production
   npm run build && npm start
   ```

### Viewing Results

1. **Access Sentry Dashboard**
   - Navigate to: https://sentry.io
   - Organization: `northwestern-university-40`
   - Project: `social-media-lurkers`

2. **Key Sections**
   - **Issues**: View all errors and exceptions
   - **Performance**: Monitor page load times and API calls
   - **Releases**: Track errors by deployment version
   - **Alerts**: Configure notifications for critical errors

### Questions Sentry Answers

✅ **Error Detection**
- What JavaScript errors are users encountering?
- Which pages/components crash most frequently?
- What browser/OS combinations have issues?
- Are errors increasing after a deployment?

✅ **User Impact**
- How many users are affected by each error?
- What user actions trigger errors?
- What's the error rate over time?
- Which errors should be prioritized?

✅ **Performance Issues**
- Which pages load slowly?
- What API calls are timing out?
- Are there memory leaks?
- What's the frontend performance score?

✅ **Debugging Context**
- What was the user doing when the error occurred?
- What's the full error stack trace?
- What were the component props/state?
- What network requests were made?

### Example Use Cases

**Scenario 1: Broken Feature**
```
User reports: "I can't like posts"
Sentry shows: TypeError in Button onClick handler
→ Fix: Update event handler type signature
```

**Scenario 2: Performance Regression**
```
Users report: "Feed is slow to load"
Sentry Performance shows: fetchFeed() taking 5+ seconds
→ Fix: Investigate backend API or add pagination
```

---

## 📈 Prometheus (Metrics Collection)

### Purpose
Prometheus collects time-series metrics about the FastAPI backend, including request counts, response times, error rates, and resource usage.

### Setup

1. **Start the Backend**
   ```bash
   cd backend
   uv venv .venv && source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows
   uv pip install -e .[dev]
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start Prometheus**
   ```bash
   # Option 1: Docker Compose (recommended)
   cd backend
   docker compose up -d prometheus
   
   # Option 2: Local Prometheus
   # Download from https://prometheus.io/download/
   # Run with: prometheus --config.file=backend/prometheus.yml
   ```

3. **Verify Prometheus is Scraping**
   - Backend metrics endpoint: http://localhost:8000/metrics
   - Prometheus UI: http://localhost:9090

### Viewing Results

1. **Access Prometheus UI**
   - Navigate to: http://localhost:9090
   - Go to **Graph** tab to query metrics
   - Go to **Targets** to verify scraping status

2. **Key Metrics Available**

   | Metric | Description | Example Query |
   |--------|-------------|---------------|
   | `http_requests_total` | Total HTTP requests | `rate(http_requests_total[5m])` |
   | `http_request_duration_seconds` | Request latency | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
   | `http_requests_inprogress` | Concurrent requests | `http_requests_inprogress` |
   | `process_cpu_seconds_total` | CPU usage | `rate(process_cpu_seconds_total[1m])` |
   | `process_resident_memory_bytes` | Memory usage | `process_resident_memory_bytes / 1024 / 1024` (MB) |

3. **Example Queries**

   **Request Rate (requests per second)**
   ```promql
   rate(http_requests_total[5m])
   ```

   **Error Rate (%)**
   ```promql
   sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
   ```

   **95th Percentile Latency**
   ```promql
   histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
   ```

   **Requests by Endpoint**
   ```promql
   sum by (handler) (rate(http_requests_total[5m]))
   ```

### Questions Prometheus Answers

✅ **Traffic & Load**
- How many requests per second is the API handling?
- Which endpoints receive the most traffic?
- What's the ratio of GET vs POST requests?
- Is traffic increasing or decreasing?

✅ **Performance**
- What's the average response time?
- What's the 95th/99th percentile latency?
- Which endpoints are slowest?
- Are response times degrading over time?

✅ **Reliability**
- What's the error rate (4xx, 5xx)?
- Which endpoints fail most often?
- Are there any 500 errors?
- Is the error rate increasing?

✅ **Resource Usage**
- How much CPU is the backend using?
- Is memory usage growing (memory leak)?
- Are there resource bottlenecks?
- Is the system under-provisioned?

✅ **Capacity Planning**
- Can the system handle peak load?
- When should we scale up?
- What's the maximum concurrent requests?
- Are we hitting rate limits?

### Example Use Cases

**Scenario 1: Slow Endpoint**
```
Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{handler="/feed"}[5m]))
Result: /feed endpoint p95 latency is 2.3 seconds
→ Action: Optimize database queries or add caching
```

**Scenario 2: High Error Rate**
```
Query: sum(rate(http_requests_total{status=~"5.."}[5m]))
Result: 5 errors per second on /posts/{id}/like
→ Action: Check application logs, investigate recent deployment
```

---

## 🔍 OpenTelemetry (Distributed Tracing)

### Purpose
OpenTelemetry provides distributed tracing to track requests as they flow through the system, showing exactly where time is spent and where bottlenecks occur.

### Setup

1. **Start OTEL Collector**
   ```bash
   cd backend
   docker compose up -d otel-collector
   ```

2. **Start Backend with OTEL**
   ```bash
   cd backend
   source .venv/bin/activate
   export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
   uvicorn app.main:app --reload --port 8000
   ```

3. **Generate Traces**
   ```bash
   # Make requests to the API
   curl http://localhost:8000/feed
   curl http://localhost:8000/profiles/some_profile_id
   curl http://localhost:8000/posts/some_post_id
   ```

### Viewing Results

OpenTelemetry traces are exported to the OTEL collector. To visualize them, you'll need a tracing backend like **Jaeger** or **Zipkin**.

**Quick Setup with Jaeger:**
```bash
# Add to docker-compose.yml or run separately
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest

# Access Jaeger UI at http://localhost:16686
```

**What You'll See:**
- **Trace Timeline**: Visual representation of request flow
- **Span Details**: Time spent in each function/operation
- **Dependencies**: How services call each other
- **Bottlenecks**: Which operations take the longest

### Questions OpenTelemetry Answers

✅ **Performance Breakdown**
- Where exactly is time spent in a request?
- Which function calls are slow?
- What's the breakdown of database vs business logic time?
- Are there unnecessary sequential operations that could be parallelized?

✅ **Request Flow**
- What's the full path of a request through the system?
- Which downstream services are called?
- Are there redundant API calls?
- What's the call hierarchy?

✅ **Latency Attribution**
- Is the slowdown in the backend or database?
- Which microservice is the bottleneck?
- Are external API calls slow?
- What's causing the tail latency?

✅ **Error Propagation**
- Where did the error originate?
- Which service failed first?
- How did the error cascade?
- What was the error context?

✅ **Optimization Opportunities**
- Can operations be cached?
- Can calls be batched?
- Are there N+1 query problems?
- Which code paths need optimization?

### Example Use Cases

**Scenario 1: Slow Feed Loading**
```
Trace shows:
- GET /feed: 1200ms total
  - get_feed(): 50ms
  - get_profile() x 20: 1100ms (55ms each)
→ Action: Implement profile caching or batch profile fetching
```

**Scenario 2: Timeout Investigation**
```
Trace shows:
- POST /posts/{id}/comment: 5000ms total
  - add_comment(): 4990ms
    - store.comments[post_id].append(): 4985ms
→ Action: Data structure inefficiency, consider database instead of in-memory
```

---

## 📊 Grafana (Visualization)

### Purpose
Grafana creates beautiful, real-time dashboards from Prometheus metrics, making it easy to monitor system health and spot trends.

### Setup

1. **Start Grafana**
   ```bash
   cd backend
   docker compose up -d grafana
   ```

2. **Access Grafana**
   - Navigate to: http://localhost:3000
   - Default credentials: `admin` / `admin` (you'll be prompted to change)

3. **Configure Prometheus Data Source**
   ```
   1. Go to Configuration > Data Sources
   2. Click "Add data source"
   3. Select "Prometheus"
   4. Set URL: http://prometheus:9090 (or http://localhost:9090 if running locally)
   5. Click "Save & Test"
   ```

4. **Import Pre-Built Dashboard**
   ```
   1. Go to Dashboards > Import
   2. Enter dashboard ID: 14282 (FastAPI Observability)
   3. Select Prometheus data source
   4. Click "Import"
   ```

### Creating Custom Dashboards

**Example: API Performance Dashboard**

1. **Create New Dashboard**
   - Click "+" > Dashboard
   - Click "Add visualization"

2. **Add Panels**

   **Panel 1: Request Rate**
   ```promql
   sum(rate(http_requests_total[5m]))
   ```
   - Visualization: Time series graph
   - Title: "Requests per Second"

   **Panel 2: Error Rate**
   ```promql
   sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
   ```
   - Visualization: Stat
   - Title: "Error Rate (%)"
   - Thresholds: Green < 1%, Yellow 1-5%, Red > 5%

   **Panel 3: Latency Heatmap**
   ```promql
   histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
   histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
   histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
   ```
   - Visualization: Time series
   - Title: "Latency Percentiles (p50, p95, p99)"

   **Panel 4: Top Endpoints by Traffic**
   ```promql
   topk(5, sum by (handler) (rate(http_requests_total[5m])))
   ```
   - Visualization: Bar chart
   - Title: "Top 5 Endpoints by Request Rate"

3. **Set Refresh Interval**
   - Click dashboard settings (gear icon)
   - Set Auto-refresh: 5s, 10s, or 30s

### Questions Grafana Answers

✅ **Real-Time Monitoring**
- What's the current system status?
- Are there any anomalies right now?
- Is a deployment causing issues?
- Are we under attack (sudden traffic spike)?

✅ **Trend Analysis**
- How has traffic grown over the past week/month?
- Are response times degrading over time?
- Is error rate trending up or down?
- What are the daily/weekly traffic patterns?

✅ **Alerting**
- Should we be notified of high error rates?
- When should we scale up resources?
- Are SLA thresholds being met?
- Is there a performance regression?

✅ **Correlation**
- Do errors correlate with traffic spikes?
- Does latency increase with memory usage?
- Are slow endpoints also high-traffic?
- Do deployments impact performance?

✅ **Capacity Planning**
- What's our headroom before hitting limits?
- When will we need to scale?
- What's the cost of current traffic?
- Are resources over/under-provisioned?

### Example Use Cases

**Scenario 1: Production Monitoring**
```
Dashboard shows:
- Request rate: 1000 req/s
- Error rate: 0.2% (green)
- p95 latency: 150ms (within SLA)
- Memory: 60% usage
→ Status: Healthy, no action needed
```

**Scenario 2: Incident Detection**
```
Dashboard shows:
- Request rate: Suddenly 5000 req/s (5x increase)
- Error rate: 15% (red alert)
- p95 latency: 5000ms (spike)
→ Action: Investigate logs, check for DDoS or bug in recent deployment
```

---

## 🚀 Complete Observability Stack Setup

### Docker Compose (All Components)

```bash
cd backend
docker compose up -d

# This starts:
# - Prometheus (metrics): http://localhost:9090
# - Grafana (dashboards): http://localhost:3000
# - OTEL Collector (tracing): http://localhost:4318
```

### Verify Everything is Running

```bash
# Check services
docker compose ps

# View logs
docker compose logs -f

# Check metrics endpoint
curl http://localhost:8000/metrics

# Check health
curl http://localhost:8000/healthz
```

### Stopping Services

```bash
# Stop all
docker compose down

# Stop specific service
docker compose stop grafana

# Remove volumes (resets data)
docker compose down -v
```

---

## 📋 Telemetry Decision Matrix

| Question | Use This Tool | Why |
|----------|---------------|-----|
| "Users report errors, what's breaking?" | **Sentry** | Captures real user errors with full context |
| "Is the API slow?" | **Prometheus + Grafana** | Shows latency trends and percentiles |
| "Which endpoint is causing the slowdown?" | **OpenTelemetry** | Traces show exact bottlenecks in code |
| "How many users are affected?" | **Sentry** | Shows user impact and error frequency |
| "Is this a frontend or backend issue?" | **Sentry** (frontend) + **OTEL** (backend) | Separates client from server issues |
| "What's the current system health?" | **Grafana** | Real-time dashboard view |
| "Are errors increasing after deployment?" | **Grafana** + **Sentry** | Time-series comparison |
| "Where should I optimize code?" | **OpenTelemetry** | Pinpoints slow functions |
| "Is memory leaking?" | **Prometheus** | Tracks memory over time |
| "What's the error rate by endpoint?" | **Prometheus** | Endpoint-level metrics |

---

## 🎓 Best Practices

### 1. **Start Simple**
- Begin with Prometheus + Grafana for basic metrics
- Add Sentry when you have real users
- Add OpenTelemetry when debugging complex issues

### 2. **Set Up Alerts**
```yaml
# Example Prometheus alert
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  annotations:
    summary: "Error rate above 5%"
```

### 3. **Regular Review**
- Check Grafana dashboards daily
- Review Sentry issues weekly
- Analyze traces when debugging

### 4. **Correlate Data**
- Cross-reference Sentry errors with Prometheus spikes
- Use timestamps to match traces with metrics
- Look for patterns across all tools

### 5. **Clean Up**
- Set retention policies (e.g., 30 days for metrics)
- Archive old Sentry issues
- Limit trace sampling in production (10-20%)

---

## 📚 Additional Resources

- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/
- **OpenTelemetry**: https://opentelemetry.io/docs/
- **Sentry**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **FastAPI Instrumentation**: https://github.com/trallnag/prometheus-fastapi-instrumentator

---

## 🆘 Troubleshooting

### Prometheus Not Scraping
```bash
# Check targets
curl http://localhost:9090/targets

# Verify metrics endpoint
curl http://localhost:8000/metrics

# Check prometheus.yml configuration
cat backend/prometheus.yml
```

### Grafana Can't Connect to Prometheus
```bash
# Ensure both are running
docker compose ps

# Check network
docker compose exec grafana ping prometheus

# Verify data source URL (should be http://prometheus:9090)
```

### Sentry Not Receiving Events
```bash
# Check DSN is set
echo $NEXT_PUBLIC_SENTRY_DSN

# Test error manually
# In browser console: throw new Error("Test error")

# Check Sentry project settings
```

### OTEL Traces Not Appearing
```bash
# Verify OTEL endpoint
echo $OTEL_EXPORTER_OTLP_ENDPOINT

# Check collector is running
docker compose logs otel-collector

# Ensure backend has telemetry enabled
# Check app/telemetry.py is imported
```

---

**Questions?** Check the logs or open an issue in the repository!

