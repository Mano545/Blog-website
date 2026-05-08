FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Match your app's port
EXPOSE 4008

CMD ["node", "Server.js"]