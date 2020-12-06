var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({

    user_id: { type: String, unique: true, required: true},
    user_name: { type: String },
    user_city: { type: String}
}, { timestamps: true });

var handleDuplicate = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

UserSchema.post('save', handleDuplicate);
UserSchema.post('update', handleDuplicate);
//roleSchema.post('findOneAndUpdate', handleDuplicate);
UserSchema.post('insertMany', handleDuplicate);
module.exports = mongoose.model('Users', UserSchema);