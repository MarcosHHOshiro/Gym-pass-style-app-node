FROM node:20-alpine AS dev
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
RUN npm ci

COPY . .

# entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3333
ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "dev"]
