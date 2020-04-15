FROM node:12-alpine

ADD package.json /tmp/package.json
RUN cd /tmp && rm -rf node_modules && npm install -q

# Code base
ADD ./ /src
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src

RUN npm run-script build

EXPOSE 4000

# node cmd is run through env consul in envconsul-launch
CMD ["node", "./dist/app.js"]
