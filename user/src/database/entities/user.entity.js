import { EntitySchema } from "typeorm";

const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        username: {
            type: 'varchar',
        },
        password: {
            type: 'varchar',
        },
        email: {
            type: 'varchar',
        },
    },
});

export default User