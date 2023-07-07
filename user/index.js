import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import User from './src/database/entities/user.entity.js';
import myDataSource from './src/database/user_db.js';
import { jwtSecret } from './user_config.js';
import rabbitMQConnect from './src/database/rabbitMQ.js';
import userDBConnect from './src/database/connectDB.js';
import redis from 'redis'

const app = express();
app.use(json())
rabbitMQConnect() // rabbitMQ
userDBConnect() // Database
const redisClient = redis.createClient() // Redis
redisClient.on("error", (error) => console.error(`Error : ${error}`));


//User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body
        const userRepository = myDataSource.getRepository(User)
        const userExist = await userRepository.findOne({ where: { username } })
        if (userExist) {
            return res.status(401).json({ error: 'Username exist' })
        }

        const hashPass = await hash(password, 10)
        const user = { username, password: hashPass, email }
        await userRepository.save(user)
        redisClient.set(username, JSON.stringify(user))
        res.status(201).json({ message: 'User registered' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const userRepo = myDataSource.getRepository('User')
        const user = await userRepo.findOne({ where: { username: username } })
        const passCheck = await compare(password, user.password)
        if (!user || !passCheck) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret)
        res.json({ token })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error })
    }
})

// Profile
app.get('/profile/:username', async (req, res) => {
    try {
        const username = req.params.username
        console.log(username)
        const token = req.rawHeaders[1].split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const tokenReceived = jwt.verify(token, jwtSecret)
        const userId = tokenReceived.userId

        let user
        const cacheData = await redisClient.get(username, (err, data) => {
            if (err) {
                console.error(err)
            }
            user = JSON.parse(data)
            console.log('parse', user)
            return res.status(200).json({
                id: user.id, username: user.username, email: user.email
            })
        })

        if (!cacheData) {
            user = await myDataSource.getRepository('User').findOneBy({ id: userId })
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            res.json({
                user: user.username,
                email: user.email
            })
        }

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
})


const port = 3003
app.listen(port, () => {
    console.log(`listening on ${port}`)
})
