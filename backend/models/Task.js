const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    text: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    deadline: {
        type: Date,
        unique: false,
        required: false
    }
    
});

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;
