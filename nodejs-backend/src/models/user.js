const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    email : String
    // favorite:[String]
});

userSchema.statics.join = function({ id, password, email }) {
    const user = new this({
        id,
        password,
        email
    });
    return user.save();
} // 회원가입

userSchema.statics.findByUser = function(id) {
    return this.findOne({ id }).exec();
}

module.exports = mongoose.model('User', userSchema);