# Use Node.js 22 as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Install additional dependencies
RUN apk add --no-cache curl

# Copy the rest of the application code
COPY . .

# Install Prisma CLI
RUN npm install -g prisma

# Start the application
CMD ["npm", "run", "dev"]