const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    state_name:{required:true,type:String}
})

module.exports = mongoose.model('state_master',StateSchema);