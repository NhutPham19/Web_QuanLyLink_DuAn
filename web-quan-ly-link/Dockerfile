FROM node:20-alpine

WORKDIR /app

# Cài dependencies trước (cache layer)
COPY package.json ./
RUN npm install --omit=dev

# Copy source code và static frontend
COPY src/ ./src/
COPY public/ ./public/

# Volume mount cho SQLite data
VOLUME ["/app/data"]

EXPOSE 3000

CMD ["node", "src/index.js"]
