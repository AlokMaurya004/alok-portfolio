# ============================================
# Alok Maurya Portfolio — Production Dockerfile
# Multi-stage build for optimized Nginx image
# ============================================

# Stage 1: Prepare static assets (optional lint/optimize step)
FROM node:20-alpine AS builder
WORKDIR /app
COPY index.html style.css script.js ./
# Assets are static — no build step needed, but stage allows future tooling

# Stage 2: Production Nginx server
FROM nginx:1.27-alpine AS production

LABEL maintainer="Alok Maurya <ak004maurya@gmail.com>"
LABEL description="Cloud-native portfolio website served via Nginx"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/style.css /usr/share/nginx/html/
COPY --from=builder /app/script.js /usr/share/nginx/html/

# Create non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
