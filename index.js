const {Webhook, MessageBuilder} = require('discord-webhook-node');
const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

// The following code is a messy piece of code I did while being half asleep. Sorry.

const MESSAGE = core.getInput('message');
const USER_MAP = {
    'stirante': '210798002808422400',
    'SirLich': '97792771619827712',
    'MedicalJewel105': '738693702297321544',
    'sermah': '305566858461970433',
    'SmokeyStack': '530361907283099650'
}
const HOOK = new Webhook(core.getInput('webhook'));

const COMMIT_URL = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/commit/${github.context.sha}`;
const RUN_URL = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`;
const COMMIT_API = `https://api.github.com/repos/${github.context.repo.owner}/${github.context.repo.repo}/commits/${github.context.sha}`;

const TENOR_GIF_URL = `https://g.tenor.com/v1/random?q=${core.getInput('gifQuery')}&key=${core.getInput('tenorGifApiKey')}&limit=1&contentfilter=medium&media_filter=minimal`

async function sendBullyMessage() {
    let author = null;
    let gif = '';
    try {
        let response = await axios.get(COMMIT_API)
        author = response.data.author.login;
        response = await axios.get(TENOR_GIF_URL)
        gif = response.data.results[0].media[0].gif.url
    } catch (e) {
        console.error('We actually failed to get the author');
        console.error(e);
    }

    let mb = new MessageBuilder()
        .setTitle(core.getInput('title'))
        .setColor(0xeb4034)
        .addField("Build failed after commit", COMMIT_URL)
        .addField("Failed build", RUN_URL)
        .setText(MESSAGE
            .replaceAll('%author%', author !== null ? (USER_MAP[author] !== void 0 ? "<@!" + USER_MAP[author] + ">" : author) : 'unknown author')
            .replaceAll('%newline%', '\n')
            .replaceAll('%gif%', gif)
        )
    await HOOK.send(mb);
}

sendBullyMessage();