FROM node:18.12-alpine

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache bash

USER node

WORKDIR /app

ARG PORT=8080
ENV PORT $PORT

EXPOSE ${PORT}
