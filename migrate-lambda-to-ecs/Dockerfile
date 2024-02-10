# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json and TS globally to build our server
RUN npm install && npm install typescript -g

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Build the TS to JS
RUN tsc

# Run our web server when the container launches
CMD ["node", "./resources/ecs-server.js"]
