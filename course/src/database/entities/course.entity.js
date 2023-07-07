import { EntitySchema } from "typeorm";

const Course = new EntitySchema({
    name: 'Course',
    tableName: 'courses',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
        },
        description: {
            type: 'varchar',
        },
    },
});

export default Course