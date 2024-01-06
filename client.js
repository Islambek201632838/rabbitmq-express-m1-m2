const amqplib = require('amqplib');

const rabbitMqUrl = 'amqp://localhost:5672';
const inputQueue = 'tasks';
const outputQueue = 'results';

async function start() {
    try {
        const connection = await amqplib.connect(rabbitMqUrl);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(inputQueue);
        await channel.assertQueue(outputQueue);

        console.log("M2 микросервис запущен и ожидает задачи...");

        channel.consume(inputQueue, async msg => {
            if (msg !== null) {
                const task = JSON.parse(msg.content.toString());
                console.log(ddd`Получена задача: ${task.number}`);

                // Имитация обработки задачи (5 секунд)
                await new Promise(resolve => setTimeout(resolve, 5000));

                const result = {
                    id: task.id,
                    number: task.number * 2 // Удвоение значения
                };

                // Отправка результата обратно в RabbitMQ
                channel.sendToQueue(outputQueue, Buffer.from(JSON.stringify(result)));
                console.log(`Отправлен результат для задачи: ${result.number}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Ошибка подключения к RabbitMQ:', error);
    }
}

start();
