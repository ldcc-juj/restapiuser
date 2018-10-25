FROM node:8

RUN mkdir -p /app/userRestApi

COPY package.json /app/userRestApi/package.json
RUN cd /app/userRestApi; npm install

COPY . /app/userRestApi

WORKDIR /app/userRestApi

CMD npm run start

EXPOSE 8081