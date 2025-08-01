const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskapp_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
