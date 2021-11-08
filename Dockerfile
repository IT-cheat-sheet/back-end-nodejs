FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY .env /usr/src/app
RUN ls -la
RUN npm install

# Bundle app source
COPY . .
RUN ls -la

EXPOSE 3000
CMD [ "npm", "start" ]
