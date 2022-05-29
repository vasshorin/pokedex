const mongoose = require('mongoose');
const Cart = require('./Cart');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
      firstname: String,
      lastname: String,
      email: String,
      password: String,
      admin: Boolean,
      wins: [{
        difficulty: String,
        score: Number,
        date: Date,
      }],
      cart: [{
        pokeID: Number,
        price: Number,
        quantity: Number,
        checkout: Boolean,
      }],
      history: [{
          pokeid: [],
          quantity: [],
          price: [],
          total: [],
          totalPerItem: [],
          createdAt: Date
    }],
    },
    {
      _id: true,
      id: true,
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("User", userSchema);