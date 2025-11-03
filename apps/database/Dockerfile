FROM postgres:18

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    postgresql-server-dev-18 \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Clone and install pg_uuidv7 extension
RUN git clone https://github.com/fboulnois/pg_uuidv7.git /tmp/pg_uuidv7 \
    && cd /tmp/pg_uuidv7 \
    && make install \
    && rm -rf /tmp/pg_uuidv7

# Copy initialization script
COPY init-uuidv7.sql /docker-entrypoint-initdb.d/

# Set the default command
CMD ["postgres"]