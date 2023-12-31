FROM node:18.16

RUN mkdir -p /home/app

ENV NODE_ENV=prod

COPY . /home/app
WORKDIR /home/app

## node_modules are deleted and reinstalled as
## bcrypt module needs to be installed on the host,
## other wise it will have missing dependencies
RUN rm -rf node_modules && npm install && npx tsc

EXPOSE 3000

CMD ["node", "/home/app/dist/app.js"]