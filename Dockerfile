FROM node:12.4-alpine
WORKDIR /server
COPY package.json .
ENV NODE_ENV production
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "build/index.js"]