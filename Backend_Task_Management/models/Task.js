const mongoose = require('mongoose');
const User = require('./User');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'], 
        default: 'pending' 
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    }
        
    
}, { timestamps: true });


module.exports = mongoose.model("Task",taskSchema);