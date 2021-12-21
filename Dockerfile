FROM node:14-alpine
WORKDIR /usr/src/app
EXPOSE 3000
ENV NODE_ENV=production
USER node
COPY --chown=node:node . /usr/src/app
CMD ["node", "./build/bin/www"]
