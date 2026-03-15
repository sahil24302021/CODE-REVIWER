FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create data directory for JSON store
RUN mkdir -p /app/data

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
