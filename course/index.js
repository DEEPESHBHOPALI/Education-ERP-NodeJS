import express from 'express';
import amqp from 'amqplib'
import myCourseDataSource from './src/database/course_db.js';
import Course from '../course/src/database/entities/course.entity.js'
import { amqpUrl } from './course_config.js';
import courseDBConnect from './src/database/connectDB.js';

const app = express();
app.use(express.json())
courseDBConnect()

// connect to RabbitMQ
let channel
async function connectToRabbitMQ() {
    const amqpServer = amqpUrl
    const connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue('user-course-queue')
}
connectToRabbitMQ()

const courseRepository = myCourseDataSource.getRepository(Course)

// Create new course
app.post('/create', async (req, res) => {
    try {
        const { name, description } = req.body
        const course = { name, description }
        await courseRepository.save(course)

        // sending to User Server
        channel.sendToQueue('user-course-queue',
            Buffer.from(
                JSON.stringify({ course })
            )
        )
        console.log(course)
        res.status(201).json({ message: 'Course created successfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error })
    }
})

// Get all courses
app.post('/course', async (req, res) => {
    try {
        const courses = await courseRepository.find()
        res.json(courses)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error })
    }
})

const port = 3001
app.listen(port, () => {
    console.log(`listening on ${port}`)
})
