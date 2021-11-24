# discord-bully

Webhook based Discord bot that notifies Bedrock OSS members on discord of failed builds.

Currently, the configuration is pretty much static, but full configuration is planned, so that others can use this action as well.

## Example configuration

Add GitHub Action secrets `WEBHOOK_ID` and `WEBHOOK_TOKEN` from Discord webhook integrations.

Add this step to GitHub Action:
```yaml
      - name: Notify of failed build
        if: ${{ failure() }}
        uses: Bedrock-OSS/discord-bully@v1.0.3
        with:
          webhook: https://canary.discord.com/api/webhooks/${{ secrets.WEBHOOK_ID }}/${{ secrets.WEBHOOK_TOKEN }}
          emoji: <:PE_PandaBonk:885395101877166110>
          title: 'Wiki deployment failed!'
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

- [ ] Move user map outside of the code to allow easier configuration.
- [ ] Move remaining message parts to the action config
