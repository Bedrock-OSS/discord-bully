# discord-bully

Webhook based Discord bot that notifies Bedrock OSS members on discord of failed builds or succeeded builds after a failed one.

Currently, the configuration is pretty much static, but full configuration is planned, so that others can use this action as well.

## Example configuration

Add GitHub Action secrets `WEBHOOK_ID` and `WEBHOOK_TOKEN` from Discord webhook integrations.
Add GitHub Action secret `TENOR_GIF_API_KEY` from Tenor GIF API.

Add this step to GitHub Action:
```yaml
      - name: Notify of failed build
        if: ${{ failure() }}
        uses: Bedrock-OSS/discord-bully@v1.0.4
        with:
          webhook: https://canary.discord.com/api/webhooks/${{ secrets.WEBHOOK_ID }}/${{ secrets.WEBHOOK_TOKEN }}
          tenorGifApiKey: ${{ secrets.TENOR_GIF_API_KEY }}
          failTitle: 'Wiki deployment failed!'
          failMessage: 'I blame %author% <:PE_PandaBonk:885395101877166110>'
          failGifQuery: 'fail'
          failAuthor: 'You messed up'
          successTitle: 'Wiki deployment succeeded!'
          successMessage: 'Thank you, %author%! <:PE_PandaInLove:885395799029194853>'
          gifSuccessQuery: 'success'
          successAuthor: 'You did it'
          failed: ${{ failure() }}
```

Add to `index.js` a map of GitHub usernames to Discord IDs like this:
```js
const USER_MAP = {
  'stirante': '210798002808422400',
  'SirLich': '97792771619827712',
  'MedicalJewel105': '738693702297321544',
  'sermah': '305566858461970433',
  'SmokeyStack': '530361907283099650'
}
```

## TODO

- [ ] Move user map outside the code to allow easier configuration.
- [ ] Move remaining message parts to the action config
