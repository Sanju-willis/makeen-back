# Use Node.js 20 image
FROM node:20

# Create app directory
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies separately for cache
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy everything else
COPY . .

# Build TypeScript -> dist/
RUN pnpm build

# Expose backend port
EXPOSE 5000

# Run the server with path alias support
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/server.js"]
