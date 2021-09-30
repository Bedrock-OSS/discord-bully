const { Webhook, MessageBuilder} = require('discord-webhook-node');
const axios = require('axios');

// The following code is a messy piece of code I did while being half asleep. Sorry.

const WEBHOOK_URL = `https://canary.discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`;

const hook = new Webhook(WEBHOOK_URL);

// const booli = "<:PE_PandaOldBooli:885396302781898822>";
const EMOJI_BONK = "<:PE_PandaBonk:885395101877166110>";

const USER_MAP = {
  'stirante': '<@!210798002808422400>',
  'SirLich': '<@!97792771619827712>',
  'MedicalJewel105': '<@!738693702297321544>',
  'sermah': '<@!305566858461970433>',
  'SmokeyStack': '<@!530361907283099650>'
}

const COMMIT_URL = 'https://github.com/Bedrock-OSS/bedrock-wiki/commit/';
const RUN_URL = 'https://github.com/Bedrock-OSS/bedrock-wiki/runs/';
const COMMIT_API = 'https://api.github.com/repos/Bedrock-OSS/bedrock-wiki/commits/';

const RUN_ID = process.env.GITHUB_RUN_ID;
const COMMIT_SHA = process.env.GITHUB_SHA;

async function sendBullyMessage() {
  let author = null;
  try {
    let response = await axios.get(COMMIT_API + COMMIT_SHA)
    author = response.data.author.login;
  } catch (e) {
    console.error('We actually failed to get the author');
    console.error(e);
  }

  let mb = new MessageBuilder()
    .setTitle("Wiki deployment failed")
    .setColor(0xeb4034)
    .addField("Build failed after commit", COMMIT_URL + COMMIT_SHA)
    .addField("Failed build", RUN_URL + RUN_ID)
  if (author !== null) {
    if (USER_MAP[author] !== void 0) {
      mb.setText("I blame " + USER_MAP[author] + " " + EMOJI_BONK)
    } else {
      mb.setText("I blame " + author + " " + EMOJI_BONK)
    }
  }
  await hook.send(mb);
}

sendBullyMessage();