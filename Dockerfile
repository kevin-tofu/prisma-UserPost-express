ARG DATABASE_URL="postgresql://root:root@100.64.1.37:5432/mydb?schema=public"
FROM node:18

# Create app directory
WORKDIR /app
COPY . .
RUN npm install package.json
RUN npx tsc
# RUN npx prisma migrate dev --name init // the command cannot run when there is NO database

EXPOSE 3000
CMD [ "node", "index.js" ]
