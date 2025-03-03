#!/bin/bash
set -e

# Variables
REPO_URL="git@github.com:Deiraheler/OnlineOrderVue.git"
CLONE_DIR="/home/ec2-user/OnlineOrderVue"
ADMIN_DIR="$CLONE_DIR/admin"
CLIENT_DIR="$CLONE_DIR/client"
SERVER_DIR="$CLONE_DIR"  # Root directory where Express server is located
PRIVATE_KEY_PATH="/home/ec2-user/.ssh/id_rsa"
NODE_APP_NAME="orms-server"  # Name for PM2 process
PUBLIC_IP="ec2-34-250-107-70.eu-west-1.compute.amazonaws.com"

# S3 variables for static hosting of frontends
ADMIN_BUCKET="my-admin-bucket"       # Replace with your admin bucket name
CLIENT_BUCKET="my-client-bucket"       # Replace with your client bucket name
REGION="eu-west-1"                     # Adjust to your bucket’s region

export HOME=/home/ec2-user

# Update system packages
echo "Updating system packages..."
sudo yum update -y

# Install required packages (including AWS CLI)
echo "Installing required packages..."
sudo yum install -y git nginx nodejs npm aws-cli

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing..."
    sudo npm install -g pm2
fi

# Ensure SSH agent is running and add the private key
echo "Setting up SSH key..."
eval "$(ssh-agent -s)"
ssh-add $PRIVATE_KEY_PATH

# Clone or update repository
if [ -d "$CLONE_DIR" ]; then
    echo "Repository already exists. Pulling latest changes..."
    cd "$CLONE_DIR"
    git fetch origin
    git pull origin main
else
    echo "Cloning repository (main branch)..."
    git clone $REPO_URL $CLONE_DIR
fi

# (Optional) Copy environment files for frontends
# (The backend .env is not modified by this deploy script—you can update it manually)
cp /home/ec2-user/.env.admin "$ADMIN_DIR/.env"
cp /home/ec2-user/.env.client "$CLIENT_DIR/.env"
cp /home/ec2-user/.env.back "$CLONE_DIR/.env"

# Build and deploy Admin Vue app
echo "Building admin panel..."
cd "$ADMIN_DIR"
npm install
npm run build

# Build and deploy Client Vue app
echo "Building client app..."
cd "$CLIENT_DIR"
npm install
npm run build

# Upload static frontends to S3
echo "Uploading Admin app to S3 bucket: ${ADMIN_BUCKET}..."
aws s3 sync "$ADMIN_DIR/dist" "s3://${ADMIN_BUCKET}" --delete

echo "Uploading Client app to S3 bucket: ${CLIENT_BUCKET}..."
aws s3 sync "$CLIENT_DIR/dist" "s3://${CLIENT_BUCKET}" --delete

# Install dependencies and start Node.js Express server (backend)
echo "Setting up Express server..."
cd "$SERVER_DIR"
npm install

# Stop any running instance of the server and start a new one
pm2 delete $NODE_APP_NAME || true
pm2 start server.js --name $NODE_APP_NAME

# Save PM2 process list so it restarts on reboot
pm2 save
sudo env PATH=$PATH $(command -v pm2) startup systemd -u ec2-user --hp /home/ec2-user


# Configure Nginx to proxy all requests (location "/") to the Express backend
echo "Configuring Nginx..."
sudo tee /etc/nginx/conf.d/backend.conf > /dev/null <<EOL
server {
    listen 80;
    server_name $PUBLIC_IP;

    location / {
         proxy_pass http://localhost:3000/;
         proxy_http_version 1.1;
         proxy_set_header Upgrade \$http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host \$host;
         proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Test Nginx configuration and restart
echo "Testing Nginx configuration..."
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid. Restarting..."
    sudo systemctl restart nginx
else
    echo "Nginx configuration test failed!"
fi

echo "Deployment completed!"
echo "Backend (via Nginx at /): http://$PUBLIC_IP/"
echo "Admin Frontend (S3): http://${ADMIN_BUCKET}.s3-website.${REGION}.amazonaws.com"
echo "Client Frontend (S3): http://${CLIENT_BUCKET}.s3-website.${REGION}.amazonaws.com"