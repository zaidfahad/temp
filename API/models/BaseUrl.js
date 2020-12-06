var mongoose = require('mongoose')

var BaseUrlSchema = new mongoose.Schema({

    BaseUrl: { type: String,  required: true},
    
}, { timestamps: true });

var handleDuplicate = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

BaseUrlSchema.post('save', handleDuplicate);
BaseUrlSchema.post('update', handleDuplicate);
//roleSchema.post('findOneAndUpdate', handleDuplicate);
BaseUrlSchema.post('insertMany', handleDuplicate);
module.exports = mongoose.model('BaseUrl', BaseUrlSchema, 'baseUrl');