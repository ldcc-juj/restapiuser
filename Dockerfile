FROM node:8

RUN mkdir -p /app/userRestApi

COPY package.json /app/userRestApi/package.json
RUN cd /app/userRestApi; npm install

RUN echo 'node version : ' && node --version
RUN echo 'npm  version : ' &&  npm --version

COPY . /app/userRestApi

WORKDIR /app/userRestApi

CMD npm run start

EXPOSE 8081