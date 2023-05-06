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
ENV DB_URL=postgresql://postgres:MM8X9PzAcIqJ0EyMqH12ExxATnaFdByL@942959b3-1229-4643-abd6-91a025e055b3.hsvc.ir:31663/postgres
ENV TELEGRAM_BOT_TOKEN=5975007396:AAGX5v1XbUBAaW32UJi9bmT3nU0qUgkFkGc
ENV TELEGRAM_CHANNEL_NAME=@jobfronttest
ENV TITLE_FILTER_KEYWORDS="junior,no visa sponsorship,no visasponsorship,no visa,entry level"
ENV OPENAI_API_KEY=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
ENV TITLE_MUST_KEYWORD="front-end, front end, frontend, react, software engineer"
ENV TELEGRAM_BOT_NAME=job_opportunity_personal_bot
# Start the application
CMD ["npm", "run", "server"]
