FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY README.md ./

# Build the project
RUN npm run build

# Expose port (if needed for any future web interface)
EXPOSE 3000

# Default command
CMD ["npm", "test"]

