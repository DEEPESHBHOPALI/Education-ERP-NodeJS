import { EntitySchema } from "typeorm";

const Grade = new EntitySchema({
    name: 'Grade',
    tableName: 'grades',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        student: {
            type: 'varchar',
        },
        subject: {
            type: 'varchar',
        },
        score: {
            type: 'varchar',
        },
    },
});

export default Grade