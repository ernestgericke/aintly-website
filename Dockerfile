# Multi-stage build for Aintly Website
# Stage 1: Build CSS
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production && \
    npm install -D tailwindcss

# Copy source files needed for build (Tailwind needs to scan HTML for used classes)
COPY tailwind.config.js ./
COPY src/ ./src/
COPY index.html ./

# Build CSS (Tailwind will scan index.html for used CSS classes)
RUN npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy built CSS from builder stage
COPY --from=builder /app/dist ./dist

# Copy application files
COPY server.js ./
COPY index.html ./
COPY src/app.js ./src/
COPY assets/ ./assets/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
