# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the backend application
COPY . .

# The application listens on port 5000
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]