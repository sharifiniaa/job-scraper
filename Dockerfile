# Set the base image
FROM node:16.17-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache \
    firefox-esr \
    dbus-x11 \
    ttf-freefont \
    fontconfig \
    udev
RUN npm install


# Copy the rest of the application code to the working directory
COPY . .
RUN npx prisma generate
# RUN npx prisma db push

# Install Chromium browser and driver dependencies
RUN apk update && apk add chromium chromium-chromedriver

# Expose the default port for the web server
EXPOSE 5000

# Set the environment variables for the PostgreSQL database and the Telegram bot
ENV DB_URL=<postgresql://DB_USER:DB_PASSWORD@DB_APP_NAME:DB_PORT/DB_NAME>
ENV TELEGRAM_BOT_TOKEN=<TELEGRAM_BOT_TOKEN>
ENV TELEGRAM_CHANNEL_NAME=<TELEGRAM_CHANNEL_NAME>
ENV TITLE_FILTER_KEYWORDS=<YOUR_KEY_FOR_FILTER_TITLES>
ENV OPENAI_API_KEY=<OPENAI_API_KEY>
ENV TITLE_MUST_KEYWORD=<TITLE_KEYWORDS_WITH_COMMA>
ENV TELEGRAM_BOT_NAME=<TELEGRAM_BOT_NAME>
# Start the application
CMD ["npm", "run", "server"]