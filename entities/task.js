const { EntitySchema } = require('typeorm');

const TaskSchema = new EntitySchema({
    name: 'Task',
    tableName: 'tasks',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        title: {
            type: 'nvarchar'
        },
        description: {
            type: 'nvarchar'
        },
        dueDate: {
            type: 'timestamp',
            default: new Date().toISOString().split('T')[0] + ' 23:59:59',
        },
        isFinished: {
            type: 'boolean',
            default: false
        }
    }
});

module.exports = TaskSchema;