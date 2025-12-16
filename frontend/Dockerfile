FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=2048"

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
ARG API_BASE_URL=http://backend:5000/api
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_URL=${API_BASE_URL}
ENV PORT=3000

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
