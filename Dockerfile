FROM node:10

RUN mkdir -p /app/mockserver

COPY package.json /app/mockserver/package.json
RUN cd /app/mockserver; npm install

RUN echo 'node version : ' && node --version
RUN echo 'npm  version : ' &&  npm --version

COPY . /app/mockserver

WORKDIR /app/mockserver

CMD npm run start

EXPOSE 3000
