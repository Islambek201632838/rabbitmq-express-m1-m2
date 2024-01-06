const express = require('express');
const amqplib = require('amqplib');

const app = express();
const port = 3000;
const rabbitMqUrl = 'amqp://localhost:5672';
const queueName = 'tasks';

app.use(express.json());

let channel = null;

async function connectRabbitMQ() {
    try {
        const connection = await amqplib.connect(rabbitMqUrl);
        channel = await connection.createChannel();
        await channel.assertQueue(queueName);
    } catch (error) {
        console.error('Ошибка подключения к RabbitMQ:', error);
    }
}

app.post('/task', async (req, res) => {
    if (typeof req.body.number !== 'number') {
        return res.status(400).send('Параметр должен быть числом');
    }

    const task = {
        number: req.body.number,
        id: Math.random().toString(36).substr(2, 9) // Генерация уникального ID для задачи
    };

    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)));
    res.status(202).send({ taskId: task.id, status: 'accepted' });
});

app.listen(port, () => {
    console.log(`M1 микросервис запущен на порту ${port}`);
    connectRabbitMQ();
});
