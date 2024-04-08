const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true,
    unique: true, 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  password: { 
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user'],
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
  }
});

userSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

userSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

userSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

const User = mongoose.model('User', userSchema);
module.exports = User