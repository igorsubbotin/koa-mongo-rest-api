'use strict';

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  email: {
    type: String,
    required: 'Enter your email',
    unique: true,
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      msg: 'Enter a correct email, please.'
    }],
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
  }
}, {
    timestamps: true
});