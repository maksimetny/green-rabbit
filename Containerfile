FROM node:alpine
WORKDIR /app
ARG SERVICE
COPY $SERVICE/main.js $SERVICE/package.json $SERVICE/
COPY amqp.js util.js package.json package-lock.json ./
RUN npm ci --no-fund
ENV SERVICE=${SERVICE}
CMD npm start -w ${SERVICE}
