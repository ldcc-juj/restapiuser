const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = mongoose.model('user', new Schema({
    name: {type: String, required: true, max: 100},
    phone: {type: String, required: true, max: 15},
    email: {type: String, required: true, max: 100},
    token: {type: String, required:true, max: 128}
}));

module.exports = {
    user
};
