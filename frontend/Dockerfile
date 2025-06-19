# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG API_URL
ENV VITE_API_URL=${API_URL}
RUN npm run build

# Serve stage
FROM node:18-alpine AS serve
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
