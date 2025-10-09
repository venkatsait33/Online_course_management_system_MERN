# Stage-1 & specify a name 'builder'
FROM  node:latest AS builder

# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install the dependence
RUN npm install

# Copy other files to my current directory
COPY . .

# Inject env variable at build time (optional)
ARG VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_API_URL

# Build and optimize static file
RUN npm run build

# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /app/dist /usr/share/nginx/html

# Open the port to react
EXPOSE 5173

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]