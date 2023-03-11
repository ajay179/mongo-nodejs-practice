const mongoose = require('mongoose');

const testCitySchema = new mongoose.Schema({
    state_name:{required:true,type:String},
    district_name:{required:true,type:String},
    taluka_name:{required:true,type:String},
    city_name:{required:true,type:String}
})

module.exports = mongoose.model('test_city_list',testCitySchema)