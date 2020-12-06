const mongoose = require('mongoose');
var winston = require('../config/winston');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);


var uri = process.env.DB_URL_DEMO;
var env = process.argv[2] || 'Dev'
 //console.log("Process=>"+ process.argv[2]);
if (env == 'Dev') {
    
uri = process.env.DB_URL_DEV
console.log(`DEv ${uri}`);
} else if (env == 'Test') {
uri = process.env.DB_URL_TEST
console.log(`DEv ${uri}`);
}else if (env == 'Prod') {
uri = process.env.DB_URL_PROD
}else if (env == 'Localhost') {
uri = process.env.DB_URL_LOCALHOST
console.log(`DEv ${uri}`);
}
console.log("uri " + uri);
mongoose.connect(uri,{ useNewUrlParser: true ,useUnifiedTopology:true })
    .then(() =>console.log(`Connected to ${env} Database`))
    .catch(err=>winston.error(err)); 

