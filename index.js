const {Webhook, MessageBuilder} = require('discord-webhook-node');
const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

// The following code is a messy piece of code I did while being half asleep. Sorry.

const FAIL_MESSAGE = core.getInput('failMessage');
const SUCCESS_MESSAGE = core.getInput('successMessage');
const FAIL_TITLE = core.getInput('failTitle');
const SUCCESS_TITLE = core.getInput('successTitle');
const FAIL_AUTHOR = core.getInput('failAuthor');
const SUCCESS_AUTHOR = core.getInput('successAuthor');

let FAILED = core.getInput('failed');

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
const RUNS_URL = `https://api.github.com/repos/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs`;

const TENOR_FAIL_GIF_URL = `https://g.tenor.com/v1/random?q=${core.getInput('gifFailQuery')}&key=${core.getInput('tenorGifApiKey')}&limit=1&contentfilter=medium&media_filter=minimal`
const TENOR_SUCCESS_GIF_URL = `https://g.tenor.com/v1/random?q=${core.getInput('gifSuccessQuery')}&key=${core.getInput('tenorGifApiKey')}&limit=1&contentfilter=medium&media_filter=minimal`

async function sendBullyOrNotMessage() {
    // not really sure in what form I get the boolean value, so this is just a check
    FAILED = FAILED === 'true' || FAILED === true || FAILED === 1;
    let author = null;
    let gif = '';
    try {
        let response = await axios.get(COMMIT_API)
        author = response.data.author.login;
    } catch (e) {
        console.error('We actually failed to get the author');
        console.error(e);
    }
    if (FAILED) {
        try {
            let response = await axios.get(TENOR_FAIL_GIF_URL);
            gif = response.data.results[0].media[0].gif.url
        } catch (e) {
            console.error('We failed to get a gif :(');
            console.error(e);
        }
        let mb = new MessageBuilder()
            .setAuthor(FAIL_AUTHOR)
            .setTitle(FAIL_TITLE)
            .setColor(0xeb4034)
            .addField("Build failed after commit", COMMIT_URL)
            .addField("Failed build", RUN_URL)
            .setImage(gif)
            .setText(FAIL_MESSAGE
                .replace('%author%', author !== null ? (USER_MAP[author] !== void 0 ? "<@!" + USER_MAP[author] + ">" : author) : 'unknown author')
                .replace('%newline%', '\n')
            )
        await HOOK.send(mb);
    } else {
        try {
            // Get list of runs
            let response = await axios.get(RUNS_URL)
            let runs = response.data.workflow_runs;
            // Find the run before
            let found = false;
            let previousRun = null;
            for (const run of runs) {
                if (found) {
                    previousRun = run;
                    break;
                }
                if (run.id === github.context.runId) {
                    found = true;
                }
            }
            if (previousRun === null) {
                console.error('We failed to find the previous run. Using the first one instead.');
                previousRun = runs[0];
            }
            // If the previous run is also successful, skip sending the message
            if (previousRun.conclusion !== 'failure') {
                return;
            }
        } catch (e) {
            console.error('We failed to get previous runs');
            console.error(e);
            return;
        }
        try {
            let response = await axios.get(TENOR_SUCCESS_GIF_URL);
            gif = response.data.results[0].media[0].gif.url
        } catch (e) {
            console.error('We failed to get a gif :(');
            console.error(e);
        }
        let mb = new MessageBuilder()
            .setAuthor(SUCCESS_AUTHOR)
            .setTitle(SUCCESS_TITLE)
            .setColor(0x32CD32)
            .setImage(gif)
            .setText(SUCCESS_MESSAGE
                .replace('%author%', author !== null ? (USER_MAP[author] !== void 0 ? "<@!" + USER_MAP[author] + ">" : author) : 'unknown author')
                .replace('%newline%', '\n')
            )
        await HOOK.send(mb);
    }
}

sendBullyOrNotMessage();