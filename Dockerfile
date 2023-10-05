# Use the official node image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY package.json ./
COPY yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["yarn", "start"]