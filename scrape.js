const playwright = require('playwright');
require('dotenv').config();
const Discord = require('discord.js');
var fs = require('fs');
var schedule = require('node-schedule');
const filePath = 'example.png'
const maxPrice = 0.8
const maxRarity = 2000
const intervallMin = 1

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


// Setup Discord
const webhookClient = new Discord.WebhookClient(process.env.DISCORD_CHANNELID, process.env.DISCORD_TOKEN);
const embed = new Discord.MessageEmbed()
    .setTitle('Rarity Fluf Checker')
    .setColor('#0099ff');

async function sendDiscord(text) {
    await webhookClient.send(text, {
        username: 'rarityFluf',
        avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embed]
    });
}

async function sendDiscordFile(text, _filePath) {
    await webhookClient.send(text, {
        username: 'rarityFluf',
        avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embed],
        files: [_filePath]
    });
}

function dateToLocalDateString(date) {
    return date.toLocaleString("de-DE", { timeZone: "Europe/Berlin" })
}


async function main() {

    const jobs = {};
    const delayHours = 0.005 // if you want to start right away give it some time like 0.006h
    const delayedStart = new Date(new Date().getTime() + (delayHours * 3600 * 1000)) // delay the first Jobrun
    console.log('\n### Starting Engines ###')
    console.log('First job on ' + dateToLocalDateString(delayedStart) + '\n')
    sendDiscord('First job on ' + dateToLocalDateString(delayedStart) + '\n');

    jobs['rarityCheckerJob'] = schedule.scheduleJob(delayedStart, async () => {

        await runJob().catch(e => console.log('Error -> schedule a new Job' + e)).then(() => {
            // calculate next job
            var nextSchedule = new Date(new Date().getTime() + 60 * intervallMin * 1000);
            console.log('Reschedule rarityCheckerJob at ' + dateToLocalDateString(nextSchedule));
            jobs['rarityCheckerJob'].reschedule(nextSchedule);
        })

    });

}

async function runJob() {
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://rarity.tools/fluf-world?filters=%24Sex%240%3Atrue%3B%26maxRank%24' + maxRarity + '%3Atrue%3B%26maxPrice%24' + maxPrice + '%3Atrue');
    await delay(10000);
    await page.hover('text=FLUF World #')
        .then(async () => {
            await page.screenshot({ path: filePath })
            await sendDiscordFile('Found NFT for your Filter:    maxPrice:' + maxPrice + '   maxRarity:' + maxRarity, filePath)
            fs.unlinkSync(filePath)
        })
        .catch(e => console.log("no NFT found" + e)).finally(async() => {await browser.close()})
    
};



// #############
// ### START ###
// #############

main()