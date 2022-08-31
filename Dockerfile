# Stage 1

FROM node:16 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app
RUN npm cache clear --force
RUN npm run build --prod 
# Stage 2
FROM nginx:1.23.1
COPY --from=build-step /app/dist/whatsapp-clone /usr/share/nginx/html