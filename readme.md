# Serverless Slack Cron

This program will take a look at aws instances and will send a message to slack channel if there are any instances to be retired

```shell
npm install -g serverless && npm install
```

Configure [aws-sdk](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html) with your credentials

To deploy

```shell
sls deploy
```
