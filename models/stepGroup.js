const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Step = require("./step");


const stepGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  steps: [Step.schema],
  userName: String,
  userAvatar: String
}, {
  timestamps: true,
});

module.exports = mongoose.model("StepGroup", stepGroupSchema);