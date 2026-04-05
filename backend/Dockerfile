from node:18
workdir /app
copy package*.json ./
run npm install
COPY . .
Expose 4008
cmd ["node","Server.js"]