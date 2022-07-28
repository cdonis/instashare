FROM node:14.17.5

# App directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

COPY . .
RUN npm install