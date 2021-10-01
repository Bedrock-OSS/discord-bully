const { Webhook, MessageBuilder} = require('discord-webhook-node');
const axios = require('axios');
const core = require('@actions/core');

// The following code is a messy piece of code I did while being half asleep. Sorry.

const WEBHOOK_URL = core.getInput('webhook');

const hook = new Webhook(WEBHOOK_URL);

const EMOJI_BONK = core.getInput('emoji');

const USER_MAP = {
  'stirante': '<@!210798002808422400>',
  'SirLich': '<@!97792771619827712>',
  'MedicalJewel105': '<@!738693702297321544>',
  'sermah': '<@!305566858461970433>',
  'SmokeyStack': '<@!530361907283099650>'
}

const COMMIT_URL = `https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}`;
const RUN_URL = `https://github.com/${process.env.GITHUB_REPOSITORY}/runs/${process.env.GITHUB_RUN_ID}`;
const COMMIT_API = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${process.env.GITHUB_SHA}`;

async function sendBullyMessage() {
  let author = null;
  try {
    let response = await axios.get(COMMIT_API)
    author = response.data.author.login;
  } catch (e) {
    console.error('We actually failed to get the author');
    console.error(e);
  }

  let mb = new MessageBuilder()
    .setTitle("Wiki deployment failed")
    .setColor(0xeb4034)
    .addField("Build failed after commit", COMMIT_URL)
    .addField("Failed build", RUN_URL)
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