const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');

require('dotenv').config();

// 使用你的 Slack Bot Token
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || 'your-slack-bot-token';

const app = express();
const port = process.env.PORT || 3000;

const client = new WebClient(SLACK_BOT_TOKEN);

// 解析 JSON 请求
app.use(bodyParser.json());

app.post('/slack/events', async (req, res) => {
    const { type, event } = req.body;

    // 验证 Slack 请求
    if (type === 'url_verification') {
        return res.status(200).send(req.body.challenge);
    }

    // 处理 Slack 消息事件
    if (event && event.type === 'message' && !event.subtype) {
        const { text, channel } = event;

        try {
            // 使用 Web API 回复消息
            await client.chat.postMessage({
                channel: channel,
                text: `你说了: ${text}`,
            });
        } catch (error) {
            console.error('Error posting message: ', error);
        }
    }

    res.status(200).end();
});

app.listen(port, () => {
    console.log(`Andrew's slack bot is listening on port ${port}`);
});