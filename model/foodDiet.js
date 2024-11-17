const mongoose = require('mongoose');

const foodDietSchema = new mongoose.Schema({
    name: { type: String, required: true },
    appoinmentDate: String,
    nextDate: String,
    earlyMorning: String,
    breakfastTime :String,
    lunchTime :String,
    postLunchSnacks :String,
    dinnerTime :String,
    lateNightSnacks :String,
    
    nameOut: String,
    earlyMorningOut: String,
    breakfastTimeOut: String,
    lunchTimeOut: String,
    postLunchSnacksOut: String,
    dinnerTimeOut: String,
    lateNightSnacksOut: String,
    // startDateOut: String
});

module.exports = mongoose.model("foodDiet", foodDietSchema);
