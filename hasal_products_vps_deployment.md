# 🚀 Hostinger VPS Deployment Guide

## Inco Tech Solutions - Computer Retail & Repair Service (MEVN Stack)

This guide will walk you through deploying your Inco Tech Solutions application (Vue.js frontend + Express.js backend) on a Hostinger VPS with the MEVN stack template using a **monorepo structure**.

---

## 📋 Prerequisites

- Hostinger VPS with Ubuntu 22.04 + MEVN Stack template installed
- SSH access to your VPS
- Your VPS IP address
- Domain name (optional, but recommended)
- GitHub repository with monorepo structure (client/ and server/ folders)

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│            Hostinger VPS Server                     │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │  Nginx (Reverse Proxy) Port 80/443      │      │
│  └──────────┬───────────────────────────────┘      │
│             │                                       │
│  ┌──────────▼──────────┐  ┌────────────────────┐  │
│  │  Vue.js Frontend    │  │  Express.js API    │  │
│  │  (Static Files)     │  │  Port 8000         │  │
│  │  /client/dist/      │  │  /server/          │  │
│  └─────────────────────┘  └──────────┬─────────┘  │
│                                       │             │
│  ┌────────────────────────────────────▼──────────┐ │
│  │  Monorepo: inco-tech-solutions                │ │
│  │  ├── client/  (Vue.js App)                    │ │
│  │  ├── server/  (Express.js API)                │ │
│  │  └── database/ (SQL Schema)                   │ │
│  └───────────────────────────────────────────────┘ │
│                          ┌──────────────────────┐  │
│                          │   MySQL Database     │  │
│                          │  inco_tech_solutions │  │
│                          └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Step 1: Connect to Your VPS

```bash
# Connect via SSH
ssh root@your_vps_ip

# Or if you have a username
ssh username@your_vps_ip
```

---

## 🔧 Step 2: Initial Server Setup

### 2.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Required Tools

```bash
# Install Git
sudo apt install git -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (if not already installed)
sudo apt install nginx -y

# Install MySQL client (if needed)
sudo apt install mysql-server -y
sudo apt install mysql-client -y
sudo systemctl status mysql
sudo systemctl start mysql
```

### 2.3 Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🗄️ Step 3: Set Up MySQL Database

### 3.1 Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to:

- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### 3.2 Create Database and User

```bash
# Login to MySQL
sudo mysql -u root -p

# Run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE inco_tech_solutions;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'inco_tech_admin'@'localhost' IDENTIFIED BY 'Velou@123';

-- Grant privileges
GRANT ALL PRIVILEGES ON inco_tech_solutions.* TO 'inco_tech_admin'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

---

## 📥 Step 4: Deploy Your Application

### 4.1 Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/inco-tech-solutions
cd /var/www/inco-tech-solutions
```

### 4.2 Clone Your Monorepo

**✨ Single Repository Advantage:** With monorepo structure, you only need to clone once!

```bash
# Method 1: Clone directly into the directory (RECOMMENDED)
cd /var/www/inco-tech-solutions
sudo git clone https://github.com/mg4aca/inco-tech-solutions.git .
# Note: The dot (.) at the end clones into current directory

# Method 2: Clone then move contents
cd /var/www
sudo git clone https://github.com/mg4aca/inco-tech-solutions.git
# This creates /var/www/inco-tech-solutions/

# Alternative: Upload via SCP from local machine
# scp -r /path/to/inco-tech-solutions/* root@your_vps_ip:/var/www/inco-tech-solutions/
```

**⚠️ Important:** Make sure your final structure is:

```
/var/www/inco-tech-solutions/
├── client/
├── server/
├── database/
└── README.md
```

NOT:

```
/var/www/inco-tech-solutions/inco-tech-solutions/  ❌ (Double nested - avoid this!)
```

### 4.3 Verify Repository Structure

```bash
# Check the monorepo structure
ls -la
# You should see: client/, server/, database/, README.md
```

### 4.4 Set Correct Permissions

```bash
# Change ownership
sudo chown -R $USER:$USER /var/www/inco-tech-solutions

# Set permissions
sudo chmod -R 755 /var/www/inco-tech-solutions
```

### 4.5 Manage Git Updates (Future Deployments)

```bash
# Fetch latest changes
git fetch --all

# Check available branches
git branch -a

# Switch to your deployment branch (main or dev)
git checkout main  # or 'dev' depending on your setup

# Pull latest changes
git pull origin main

# If merge conflicts occur:
git reset --hard origin/main  # WARNING: This discards local changes
```

## 🔨 Step 5: Set Up Backend (Server)

### 5.1 Navigate to Server Directory

```bash
cd /var/www/inco-tech-solutions/server
```

### 5.2 Install Dependencies

```bash
npm install --production
```

### 5.3 Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inco_tech_solutions
DB_USER=inco_tech_admin
DB_PASSWORD=Velou@123

# Application
NODE_ENV=production
PORT=8000
HOST=0.0.0.0

# File Upload Path
UPLOAD_DIR=./uploads

# CORS Configuration (update with your domain)
CORS_ORIGIN=https://incotechsolutions.com

# Optional: JWT Secret (if implementing authentication later)
JWT_SECRET=generate_with_command_below
JWT_EXPIRES_IN=24h
```

**To generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5.4 Initialize Database Schema

```bash
# Option 1: Run migrations using npm script (recommended)
cd /var/www/inco-tech-solutions/server
npm run migrate

# Option 2: Run migrations directly
cd /var/www/inco-tech-solutions/server/migrations
node run-migrations.js

# Option 3: Manual import from database/schema.sql
cd /var/www/inco-tech-solutions
mysql -u inco_tech_admin -p inco_tech_solutions < database/schema.sql
```

**Note:** The schema.sql includes seed data for categories and sample products.

### 5.5 Test Backend Locally (Optional)

**⚠️ Note:** If you've already set up PM2 (step 5.6), skip this manual test as port 8000 will already be in use. Jump directly to testing via PM2 logs.

```bash
# Make sure you're in the server directory
cd /var/www/inco-tech-solutions/server

# Test if backend works
node server.js

# In another terminal, test the API
curl http://localhost:5005/api/products
curl http://localhost:5005/api/categories
```

If successful, you should see JSON responses. Press `Ctrl+C` to stop.

**If you get "EADDRINUSE: address already in use" error:**

```bash
# Check what's using port 8000
sudo lsof -i :5005

# If PM2 is running, stop it first
pm2 stop inco-tech-backend

# Or skip manual test and use PM2 logs instead (recommended)
pm2 logs inco-tech-backend
```

### 5.6 Set Up PM2 for Backend

```bash
# Make sure you're in the server directory
cd /var/www/inco-tech-solutions/server

# Start backend with PM2
pm2 start server.js --name inco-tech-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it provides

# Check status
pm2 status
```

**Useful PM2 Commands:**

```bash
# View logs
pm2 logs inco-tech-backend

# Restart app
pm2 restart inco-tech-backend

# Stop app
pm2 stop inco-tech-backend

# Monitor resources
pm2 monit

# Delete from PM2
pm2 delete inco-tech-backend
```

---

## 🎨 Step 6: Set Up Frontend (Client)

### 6.1 Navigate to Client Directory

**✨ Monorepo Advantage:** Frontend is in the same repository!

```bash
cd /var/www/inco-tech-solutions/client
```

### 6.2 Configure API Endpoint

Create production environment file:

```bash
cd /var/www/inco-tech-solutions/client
nano .env.production
```

Add your production API URL:

```env
VITE_API_BASE_URL=https://incotechsolutions.com/api
# Or use IP if no domain: http://your_vps_ip/api
```

**Note:** The Vue app is already configured to read from `src/api/index.js` which uses environment variables.

### 6.3 Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with optimized static files.

### 6.4 Move Build to Nginx Directory

```bash
# Create directory for frontend
sudo mkdir -p /var/www/inco-tech-solutions/dist

# Copy built files from client/dist to web root
sudo cp -r /var/www/inco-tech-solutions/client/dist/* /var/www/inco-tech-solutions/dist/

# Set permissions
sudo chown -R www-data:www-data /var/www/inco-tech-solutions/dist
sudo chmod -R 755 /var/www/inco-tech-solutions/dist
```

---

## 🌐 Step 7: Configure Nginx

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/inco-tech-solutions
```

Add this configuration:

```nginx
# Upstream backend
upstream inco_tech_backend {
    server localhost:5005;
    keepalive 64;
}

server {
    listen 80;
    server_name incotechsolutions.com www.incotechsolutions.com;  # Replace with your domain or VPS IP

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Max upload size (for product images)
    client_max_body_size 10M;

    # Frontend - Serve Vue.js app
    location / {
        root /var/www/inco-tech-solutions/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Express.js
    location /api/ {
        proxy_pass http://inco_tech_backend/api/;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Disable cache for API
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files (product images)
    location /uploads/ {
        alias /var/www/inco-tech-solutions/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/inco-tech-access.log;
    error_log /var/log/nginx/inco-tech-error.log;
}
```

### 7.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/inco-tech-solutions /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

---

## 🔒 Step 8: Set Up SSL (Optional but Recommended)

### 8.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Obtain SSL Certificate

**Note:** You need a domain name pointed to your VPS IP for this step.

```bash
# Replace with your domain
sudo certbot --nginx -d incotechsolutions.com -d www.incotechsolutions.com
```

Certbot will:

- Obtain certificate
- Automatically configure Nginx for HTTPS
- Set up automatic renewal

### 8.3 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 8.4 Update Frontend API URL for HTTPS

After SSL is set up, update your frontend environment:

```bash
nano /var/www/inco-tech-solutions/client/.env.production
```

Change to HTTPS:

```env
VITE_API_BASE_URL=https://incotechsolutions.com/api
```

Rebuild and redeploy frontend:

```bash
cd /var/www/inco-tech-solutions/client
npm run build
sudo cp -r dist/* /var/www/inco-tech-solutions/dist/
sudo systemctl restart nginx
```

---

## ✅ Step 9: Verify Deployment

### 9.1 Check Backend

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs inco-tech-backend

# Test API directly
curl http://localhost:5005/api/products
curl http://localhost:5005/api/categories
```

### 9.2 Check Nginx

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/inco-tech-error.log
sudo tail -f /var/log/nginx/inco-tech-access.log
```

### 9.3 Test Application

Open your browser and visit:

- 🌎 Frontend: `http://your_vps_ip` or `https://incotechsolutions.com`
- 🔌 API Test: `http://your_vps_ip/api/products` or `https://incotechsolutions.com/api/products`

You should see your Inco Tech Solutions storefront with products!

---

## 🔄 Step 10: Deployment Script (For Updates)

**🎯 Monorepo Advantage:** Single deployment script for both frontend and backend!

Create a deployment script for easy updates:

```bash
nano /var/www/inco-tech-solutions/deploy.sh
```

Add this script:

```bash
#!/bin/bash

echo "🚀 Starting Inco Tech Solutions Deployment..."
echo "=============================================="

# Navigate to project root
cd /var/www/inco-tech-solutions

# Pull latest changes from Git
echo "📥 Pulling latest changes from repository..."
git fetch --all
git pull origin development  # Change to 'dev' if using development branch

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed! Please resolve conflicts manually."
    exit 1
fi

# Backend deployment
echo ""
echo "🔨 Deploying Backend..."
echo "----------------------"
cd server
npm install --production

# Restart backend with PM2
echo "♻️  Restarting backend service..."
pm2 restart inco-tech-backend

# Check backend status
pm2 status inco-tech-backend

# Frontend deployment
echo ""
echo "🎨 Deploying Frontend..."
echo "----------------------"
cd ../client

# Install dependencies
npm install

# Build for production
echo "📦 Building Vue.js application..."
npm run build

# Copy to nginx directory
echo "📋 Copying build files to web root..."
sudo cp -r dist/* /var/www/inco-tech-solutions/dist/

# Restart Nginx
echo ""
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx

# Final status check
echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📊 Service Status:"
pm2 status
echo ""
sudo systemctl status nginx --no-pager -l

echo ""
echo "🎉 Inco Tech Solutions has been updated successfully!"
```

Make it executable:

```bash
chmod +x /var/www/inco-tech-solutions/deploy.sh
```

### Run Future Deployments

Whenever you push changes to GitHub, just run:

```bash
cd /var/www/inco-tech-solutions
./deploy.sh
```

### Alternative: Manual Deployment Steps

If you prefer manual control:

```bash
# 1. Pull latest code
cd /var/www/inco-tech-solutions
git pull origin main

# 2. Update backend
cd server
npm install --production
pm2 restart inco-tech-backend

# 3. Update frontend
cd ../client
npm install
npm run build
sudo cp -r dist/* /var/www/inco-tech-solutions/dist/

# 4. Restart services
sudo systemctl restart nginx
```

---

## 🛠️ Maintenance Commands

### Check Application Status

```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Check disk space
df -h

# Check memory usage
free -m
```

### View Logs

```bash
# Backend logs
pm2 logs inco-tech-backend

# Nginx access logs
sudo tail -f /var/log/nginx/inco-tech-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/inco-tech-error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log

# View last 100 lines of backend logs
pm2 logs inco-tech-backend --lines 100
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
mysqldump -u inco_tech_admin -p inco_tech_solutions > ~/backups/inco_tech_$(date +%Y%m%d_%H%M%S).sql

# Create automated backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
mysqldump -u inco_tech_admin -p'your_password' inco_tech_solutions > $BACKUP_DIR/inco_tech_$(date +%Y%m%d_%H%M%S).sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "inco_tech_*.sql" -mtime +7 -delete

echo "Backup completed: $(date)"
```

```bash
chmod +x ~/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add this line: 0 2 * * * /home/username/backup-db.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs inco-tech-backend

# Common issues:
# 1. Port 8000 already in use
sudo lsof -i :5005
sudo kill -9 <PID>

# 2. Database connection failed
# Check .env file and MySQL credentials
cd /var/www/inco-tech-solutions/server
cat .env
mysql -u inco_tech_admin -p inco_tech_solutions

# 3. Missing dependencies
cd /var/www/inco-tech-solutions/server
npm install
pm2 restart inco-tech-backend
```

### Frontend Not Loading

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/inco-tech-error.log

# Verify files exist
ls -la /var/www/inco-tech-solutions/dist

# Test Nginx configuration
sudo nginx -t

# Rebuild frontend if needed
cd /var/www/inco-tech-solutions/client
npm run build
sudo cp -r dist/* /var/www/inco-tech-solutions/dist/

# Restart Nginx
sudo systemctl restart nginx
```

### 502 Bad Gateway

```bash
# Backend is not running
pm2 status
pm2 restart inco-tech-backend

# Check backend is listening on port 8000
sudo netstat -tlnp | grep 8000
# Or use:
sudo lsof -i :5005

# Check backend logs for errors
pm2 logs inco-tech-backend --err
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u inco_tech_admin -p inco_tech_solutions

# Check MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check backend .env file
cat /var/www/inco-tech-solutions/server/.env

# Test connection from Node.js
cd /var/www/inco-tech-solutions/server
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host:'localhost', user:'inco_tech_admin', password:'your_password', database:'inco_tech_solutions'}); conn.connect(err => {if(err) console.error(err); else console.log('Connected!'); conn.end();});"
```

### Migration Says "No migration files found"

```bash
# Check if SQL files exist in migrations folder
ls -la /var/www/inco-tech-solutions/server/migrations/
# You should see: 001_initial_schema.sql, 002_seed_initial_data.sql

# If files are missing, you may have:
# 1. Double nested directory structure (wrong path)
pwd  # Should show: /var/www/inco-tech-solutions
# NOT: /var/www/inco-tech-solutions/inco-tech-solutions

# 2. Files not committed to git - check locally
git status

# 3. Wrong branch checked out
git branch
git checkout main

# 4. Pull latest changes
git pull origin main

# Verify correct structure:
cd /var/www/inco-tech-solutions
ls -la
# Should see: client/, server/, database/, README.md
```

---

## 📊 Monitoring Setup (Optional)

### Install Monitoring Tools

```bash
# Install htop for resource monitoring
sudo apt install htop -y

# Use PM2 monitoring
pm2 install pm2-server-monit
```

### Set Up PM2 Web Dashboard

```bash
# Install PM2 web interface
pm2 install pm2-web

# Access at: http://your_vps_ip:9615
```

---

## 🎯 Performance Optimization

### Enable Gzip Compression in Nginx

Edit `/etc/nginx/nginx.conf`:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### Configure Node.js for Production

In PM2 configuration (if you need cluster mode for better performance):

```bash
# Stop current instance
pm2 stop inco-tech-backend
pm2 delete inco-tech-backend

# Start with cluster mode (uses all CPU cores)
cd /var/www/inco-tech-solutions/server
pm2 start server.js --name inco-tech-backend -i max --node-args="--max-old-space-size=1024"

# Or create ecosystem config file
pm2 ecosystem
```

Edit `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'inco-tech-backend',
      script: './server.js',
      cwd: '/var/www/inco-tech-solutions/server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '1G',
    },
  ],
};
```

Then start with:

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## 📚 Additional Resources

- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Certbot](https://certbot.eff.org/)

---

## 📞 Support

If you encounter issues:

1. Check logs first (`pm2 logs`, nginx logs)
2. Verify all services are running
3. Check firewall settings
4. Review configuration files
5. Restart services in order: MySQL → Backend → Nginx

---

## 🎉 Congratulations!

Your **Inco Tech Solutions** Computer Retail & Repair Service is now live on Hostinger VPS!

**Access your application at:**

- 🌐 **Frontend:** `http://your_vps_ip` or `https://incotechsolutions.com`
- 🔌 **Backend API:** `http://your_vps_ip/api` or `https://incotechsolutions.com/api`
- 🖼️ **Product Images:** `http://your_vps_ip/uploads/` or `https://incotechsolutions.com/uploads/`

**Test endpoints:**

```bash
# Get all products
curl https://incotechsolutions.com/api/products

# Get all categories
curl https://incotechsolutions.com/api/categories

# Get single product
curl https://incotechsolutions.com/api/products/1

# Submit repair request
curl -X POST https://incotechsolutions.com/api/repairs \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Test User","email":"test@email.com","phone":"1234567890","device_type":"laptop","device_model":"Test Model","issue_description":"Test issue"}'
```

---

## 📝 Post-Deployment Checklist

- [ ] **Backend is running** - `pm2 status` shows inco-tech-backend online
- [ ] **Database created** - inco_tech_solutions database exists with tables
- [ ] **Database seeded** - Categories and sample products are loaded
- [ ] **Frontend built** - Vue.js app compiled to `/dist/`
- [ ] **Nginx configured** - Site config created and enabled
- [ ] **API accessible** - Can fetch products from `/api/products`
- [ ] **Frontend loads** - Homepage shows products and categories
- [ ] **Images upload** - Product image upload folder has correct permissions
- [ ] **SSL certificate** - HTTPS enabled (if using domain)
- [ ] **Firewall configured** - Ports 80, 443, 22 are allowed
- [ ] **Backups automated** - Daily database backup cron job set up
- [ ] **Monitoring setup** - PM2 monitoring and logs accessible
- [ ] **Deployment script ready** - `deploy.sh` created and tested
- [ ] **Environment variables** - Backend `.env` configured correctly
- [ ] **Git repository** - Monorepo cloned and pulling updates works

---

## 🚀 Quick Command Reference

### Daily Operations

```bash
# Check all services
pm2 status && sudo systemctl status nginx && sudo systemctl status mysql

# View live logs
pm2 logs inco-tech-backend --lines 50

# Restart everything
pm2 restart inco-tech-backend && sudo systemctl restart nginx

# Deploy updates
cd /var/www/inco-tech-solutions && ./deploy.sh
```

### Monorepo Structure Benefits

✅ **Single `git clone`** - Get everything at once  
✅ **Atomic commits** - Frontend and backend changes stay in sync  
✅ **Shared dependencies** - Easier to manage versions  
✅ **Simpler CI/CD** - One pipeline for both services  
✅ **Better collaboration** - Full context in one repository

---

**Last Updated:** February 2026  
**Version:** 2.0.0 (Monorepo Edition)  
**Project:** Inco Tech Solutions - Computer Retail & Repair Service
