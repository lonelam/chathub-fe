#!/bin/bash

# Directory containing the build artifacts
BUILD_DIR="./build"

# Server and path configurations
SERVER_USER="root"
SERVER_HOST="laizn.com"
SERVER_PATH="/www/chathub"

yarn build

# Ensure build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Build directory does not exist. Please build the project first."
    exit 1
fi

# Deploy the build directory to the server
echo "Deploying to $SERVER_HOST..."
scp -r $BUILD_DIR/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH

echo "Deployment complete."
