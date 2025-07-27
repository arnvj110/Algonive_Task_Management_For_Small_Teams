const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  message: { 
    type: String 

  },
  read: { 
    type: Boolean, 
    default: false 

  },
  type: { 
    type: String 

  }, // assignment, reminder, mention, etc.
  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 

  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
