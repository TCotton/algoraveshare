FROM postgres:18

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-server-dev-18 \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set the default command
CMD ["postgres"]