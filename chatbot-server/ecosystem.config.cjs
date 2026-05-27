// PM2 process config. Start with:  pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'bintang-chatbot',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '200M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
