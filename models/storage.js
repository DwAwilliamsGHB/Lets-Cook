const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storageSchema = new Schema({
    content: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    userAvatar: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Storage", storageSchema);