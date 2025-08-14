# Use Node LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Start app
CMD ["node", "index.js"]
