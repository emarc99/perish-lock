# PerishLock Mission Control & Strands Agent Runtime
# Multi-stage production container for Amazon Bedrock AgentCore & App Runner / ECS

FROM python:3.11-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY perishlock/ ./perishlock/
COPY web/ ./web/
COPY fixtures/ ./fixtures/
COPY deploy/ ./deploy/
COPY pyproject.toml LICENSE README.md ./

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8000 \
    AWS_DEFAULT_REGION=us-east-1

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/status || exit 1

# Start Mission Control API server
CMD ["python", "-m", "perishlock.api.server"]
