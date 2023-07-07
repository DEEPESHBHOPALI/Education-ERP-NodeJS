import { DataSource } from "typeorm";
import { username, password, database, dbPort } from '../../grade_config.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname + '/entities/*.entity.js')
const myGradeDataSource = new DataSource({
    type: database,
    host: 'localhost',
    port: dbPort,
    username,
    password,
    database: 'grade',
    entities: [__dirname + '/entities/*.entity.js'],
    synchronize: true,
})

export default myGradeDataSource
