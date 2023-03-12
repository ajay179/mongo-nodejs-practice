const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    // stateId:{}
    cityName:{type:String,required:true}
});