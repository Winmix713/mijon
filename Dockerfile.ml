FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY ml_pipeline/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML pipeline code
COPY ml_pipeline/ ml_pipeline/
COPY model_config.yaml .

# Create logs directory
RUN mkdir -p ml_pipeline/logs

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Run prediction engine
CMD ["python", "-u", "ml_pipeline/prediction_engine.py", "--info"]
