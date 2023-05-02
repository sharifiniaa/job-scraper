## Job Scraper with Node.js and Selenium

![](https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/7a9c0b7bfc031d7148ea53d6a6bcc417ae3280dae7ce82a8.png)

This job scraper tool, developed with Node.js and Selenium, scrapes job postings from a job listing website(LinkedIn know), saves them in a PostgreSQL database, and sends them to a Telegram channel. You can customize the search by location and keyword and filter the results by title keywords.

  
It's the kind of bot and channel you can create for yourself and use for gathering linked jobs and making cover letters via openAi API.

> This project has two types of start : 
> 
> 1.  on your system with npm start, for example : `npm start -- --locations="location1" "location2" --keyword="keyword" [--d]`
> 2.  run as a web server with `npm run server`. In this approach you can have both a rest api for starting scrapper or using a telegram bot.

## Requirements

Node.js (v14 or higher)

PostgreSQL

Selenium WebDriver

## Prerequisites

To use this project, the following conditions are required:

Node.js and npm: You can download and install them from the official website: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

PostgreSQL database: You need to create a database and set up the database URL in the `.env` file. You can download and install PostgreSQL from the official website: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

Telegram bot token: You must create a bot and get the bot token. You can follow the instructions in the Telegram documentation: [https://core.telegram.org/bots#creating-a-new-bot](https://core.telegram.org/bots#creating-a-new-bot)

Telegram channel: You must create a channel on Telegram and get the channel name with the "@" prefix. You can follow the instructions in the Telegram documentation: [https://telegram.org/tour/channels#create-a-channel](https://telegram.org/tour/channels#create-a-channel).

## Installation

Clone the repository: `git clone https://github.com/yourusername/job-scraper.git`

Navigate to the project directory: `cd job-scraper`

Install the dependencies: `npm install`

## Usage

To start the job scraper tool, run the following command:

npm start -- --locations="location1" "location2" --keyword="keyword" \[--d\]

Replace `location1` and `location2` with the locations you want to search for, and `keyword` with the keyword, you wish to search for. You can also add the optional `--d` the argument for including job descriptions in the results.

## Telegram Bot Usage

*   For starting the scraper you can use `/start Sweden - "front end" OR “react”` command.
*   For generating a cover letter for a job description `/cover-letter <jobID>`

## Configuration

You need to set up the following environment variables in the `.env` file:

`DB_URL`: The URL of the PostgreSQL database.

`TELEGRAM_BOT_TOKEN`: The token of the Telegram bot you created.

`TELEGRAM_CHANNEL_NAME`: The name of the Telegram channel with the "@" prefix.

`TITLE_FILTER_KEYWORDS`: A comma-separated list of keywords to filter the job listings by title.

`TITLE_FILTER_KEYWORDS`: You need to set the title filter keywords in the `.env` file. These keywords are used to filter the job listings based on their titles.

`TITLE_MUST_KEYWORD`: You can simply add some key that you want to be in the title for the gathering.

`OPENAI_API_KEY`: This key is required for using the cover letter generator.

## Customization

You can customize the scraper by modifying the following variables in the `src/config.ts` file:

`jobSites`: an array of objects that define the job search websites to be scraped. Each object should have the following properties:

`name`: the name of the job site

`url`: the URL of the job search page

`pagination`: a boolean indicating whether or not pagination is required to extract all job postings on the site

`selectors`: an object that contains CSS selectors for the job title, company name, and job location on the job search page

`searchSettings`: an object that defines the search settings for the job scraper. The thing should have the following properties:

`keywords`: an array of keywords to search for

`locations`: a variety of locations to search in

`dbSettings`: an object that defines the database settings for the scraper. The thing should have the following properties:

`url`: the URL of the PostgreSQL database

`telegramSettings`: an object that defines the Telegram settings for the scraper. The thing should have the following properties:

`botToken`: the token for your Telegram bot

`channelName`: the name of the Telegram channel to send the data to

`filterSettings`: an array of keywords to filter job postings based on their title.

## Note

*   For more information about searching by keyword, please check this link [5 Tips on How to Search LinkedIn Like a Pro](https://blog.linkedin.com/2007/07/15/5-tips-on-how-t).
