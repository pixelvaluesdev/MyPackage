FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application source
COPY . .

# Expose API port
EXPOSE 6001

# Start app using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
