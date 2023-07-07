import { DataSource } from "typeorm";
import { username, password, database, dbPort } from '../../course_config.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const myCourseDataSource = new DataSource({
    type: database,
    host: 'localhost',
    port: dbPort,
    username,
    password,
    database: 'coursedb',
    entities: [__dirname + '/entities/*.entity.js'],
    synchronize: true,
})

export default myCourseDataSource
