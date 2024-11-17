const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    loginId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    mobile: { type: String, required: true },
    // roleId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'role',
    //     required :true,
    // },
})

module.exports = mongoose.model("users", userSchema)