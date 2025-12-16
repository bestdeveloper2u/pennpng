FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend ./backend
RUN mkdir -p backend/uploads

EXPOSE 5000
CMD ["npm", "run", "start:server"]
