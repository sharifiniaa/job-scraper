module.exports = {
  apps: [
    {
      name: 'job-scraper',
      script: 'npm',
      args: 'start -- --locations="Netherlands" "Sweden" "Finland" "france" "United kingdom" "Denmark" --keyword=\'"frontend" OR "front-end" OR "React"\'',
      cron_restart: '0 0 * * *',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      time: true,
    },
  ],
};
