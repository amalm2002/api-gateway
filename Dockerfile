FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p dist/modules/user/config \
&& cp src/modules/user/config/user.proto dist/modules/user/config/user.proto

RUN mkdir -p dist/modules/payment/config \
    && cp src/modules/payment/config/payment.proto dist/modules/payment/config/payment.proto

EXPOSE 5050

CMD ["node", "dist/server.js"]
