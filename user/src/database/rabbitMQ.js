import amqp from 'amqplib'
import { amqpUrl } from '../../user_config.js';

let channel
async function connectToRabbitMQ() {
    const amqpServer = amqpUrl
    const connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue('user-course-queue')
}

const rabbitMQConnect = () => {
    connectToRabbitMQ().then(() => {
        channel.consume('user-course-queue', data => {
            const course = JSON.parse(data.content)
            console.log('Course Received:', course)
            return course
        })
    })
}

export default rabbitMQConnect