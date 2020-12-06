var mongoose = require('mongoose')

var RefWorkItemSchems = new mongoose.Schema({

    sNo: { type: String},
    epic: { type: String },
    feature: { type: String},
    userStory: { type: String },
    description: { type: String}
        }, { timestamps: true});
   // }, { timestamps: true ,collation:"referenceWorkItem"});
//referenceworkitems 
var handleDuplicate = (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

RefWorkItemSchems.post('save', handleDuplicate);
RefWorkItemSchems.post('update', handleDuplicate);
RefWorkItemSchems.post('findOneAndUpdate', handleDuplicate);
RefWorkItemSchems.post('insertMany', handleDuplicate);
//module.exports = mongoose.model('referenceworkitems', RefWorkItemSchems);
module.exports = mongoose.model('referenceworkitems', RefWorkItemSchems,'referenceWorkItem');