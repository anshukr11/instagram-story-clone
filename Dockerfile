# Use the official Node.js image as a base
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /news-aggregrator

# Copy the rest of the application code
COPY . .

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port on which your React app runs (typically 3000)
EXPOSE 3000

# Command to run the React app
CMD ["npm", "start"]