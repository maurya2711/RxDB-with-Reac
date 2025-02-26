const businessSchema = {
    title: 'business schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' }
    },
    required: ['id', 'name']
};

export default businessSchema;
