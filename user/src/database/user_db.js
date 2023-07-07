import { DataSource } from "typeorm";
import { database, username, password } from "../../user_config.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname + '/entities/*.entity.js')
const myDataSource = new DataSource({
    type: database,
    host: 'localhost',
    port: 5432,
    username,
    password,
    database: 'usersdb',
    entities: [__dirname + '/entities/*.entity.js'],
    synchronize: true,
})

export default myDataSource