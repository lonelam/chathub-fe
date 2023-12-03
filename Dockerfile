# Step 1: Build the project
# Use a Node.js image to build the project
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Step 2: Set up Nginx to serve the built project
FROM nginx:alpine
# Copy the build output from the previous stage
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copy Nginx configuration file (if you have a custom one)
COPY scripts/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

COPY ./scripts/start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]