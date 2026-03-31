FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p public/uploads data
EXPOSE 3001
CMD ["node", "server.js"]
