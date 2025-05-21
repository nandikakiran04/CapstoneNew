# Use official Node.js LTS image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

EXPOSE 5000

# Default command to run the backend services concurrently
CMD ["npm", "start"]
