FROM node:12.4-alpine
WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ['npm', 'run', 'start']