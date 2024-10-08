# Stage 1: Build the React application
FROM node:20.11-alpine as builder

WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json  ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build


# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove the default Nginx HTML files
RUN rm -rf ./*

# Copy the build output from the previous stage
COPY --from=builder /app/build .

# Expose port 3000
EXPOSE 3000

# Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
