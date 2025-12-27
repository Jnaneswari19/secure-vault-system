# Use an official Node.js runtime as base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Compile contracts
RUN npx hardhat compile

# Default command (you can override in docker run)
CMD ["npx", "hardhat", "test"]
