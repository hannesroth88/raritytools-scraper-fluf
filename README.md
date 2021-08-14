# raritytools-scraper-fluf
Scheduled scraper of rarity tools. Sending notifications via discord if good nft is on sale.

# Requirements
1. install nodejs
2. run ```npm install```
3. create a Discord channel, insert credentials in .env File
4. ```npm i -D @playwright/test```
5. ```npx playwright install```

# How to run
## Develop
node -r esm .\scrape.js

## Production
sudo pm2 start .\scrape.js

## debug/log
sudo pm2 list
sudo pm2 logs 0 --lines 1000

## .env File
### create a .env file in the root with the following content and change to your credentials:
```
DISCORD_CHANNELID=idxxx
DISCORD_TOKEN=tokenxxx
```
