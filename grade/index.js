import express from 'express';
import amqp from 'amqplib'
import myGradeDataSource from './src/database/grade_db.js';
import { amqpUrl } from './grade_config.js';
import Grade from './src/database/entities/grade.entity.js'
import gradeDBConnect from './src/database/connectDB.js';

const app = express();
app.use(express.json())
gradeDBConnect()
const gradeRepository = myGradeDataSource.getRepository(Grade);

// connect to RabbitMQ
let channel
async function connectToRabbitMQ() {
    const amqpServer = amqpUrl
    const connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue('user-course-queue')
}
connectToRabbitMQ()

// Login
app.post('/login', async (req, res) => {
    try {
        const { student, subject, score } = req.body
        const grades = { student, subject, score }
        const gradeData = await gradeRepository.save(grades)
        // sending to User Server
        channel.sendToQueue('user-course-queue',
            Buffer.from(
                JSON.stringify({ gradeData })
            )
        )
        res.status(201).json({ gradeData })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error })
    }
})

const port = 3002
app.listen(port, () => {
    console.log(`listening on ${port}`)
})
