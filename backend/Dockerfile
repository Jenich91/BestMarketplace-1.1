# backend/Dockerfile

# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY ./app/package*.json ./
COPY ./app/tsconfig*.json ./
RUN npm install

# Копируем остальные файлы приложения в контейнер
COPY ./app/src ./src/
COPY ./app/.env ./

# Открываем порт сервера
EXPOSE 5000

# Запускаем сервер с помощью ts-node
CMD ["npx", "ts-node", "src/server.ts"]
