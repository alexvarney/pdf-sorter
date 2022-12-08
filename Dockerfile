FROM node:16-alpine as build
RUN apk add --update yarn

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build


FROM nginx:1.21.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80