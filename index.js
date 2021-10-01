const { Webhook, MessageBuilder} = require('discord-webhook-node');
const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

// The following code is a messy piece of code I did while being half asleep. Sorry.

const EMOJI = core.getInput('emoji');
const USER_MAP = JSON.parse(core.getInput('usermap'));
const HOOK = new Webhook(core.getInput('webhook'));

const COMMIT_URL = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/commit/${github.context.sha}`;
const RUN_URL = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`;
const COMMIT_API = `https://api.github.com/repos/${github.context.repo.owner}/${github.context.repo.repo}/commits/${github.context.sha}`;

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
    .setTitle(core.getInput('title'))
    .setColor(0xeb4034)
    .addField("Build failed after commit", COMMIT_URL)
    .addField("Failed build", RUN_URL)
  if (author !== null) {
    if (USER_MAP[author] !== void 0) {
      mb.setText("I blame <@!" + USER_MAP[author] + "> " + EMOJI)
    } else {
      mb.setText("I blame " + author + " " + EMOJI)
    }
  }
  await HOOK.send(mb);
}

sendBullyMessage();