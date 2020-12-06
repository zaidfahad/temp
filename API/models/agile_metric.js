var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
 //var db = mongoose.connection;
 var AgileMetric;
 
//  db.on('error', console.error.bind(console, 'connection error:'));
 
// db.once('open', function() {
var AzureConnectionSchema = new mongoose.Schema({
     ProjectName:{type:String},
     OrgUrl:{type:String},
     token:{type:String},
    },{timestamps:true });

var AgileMetricSchema = new mongoose.Schema({
    MetricName: { type: String },
    Expected: { type: Number},       
        }, { timestamps: true});

AgileMetric = mongoose.model('AgileMetric', AgileMetricSchema, 'AgileMetric');
AzureConnection = mongoose.model('AzureConnection', AzureConnectionSchema, 'AzureConnection');
 
// });
async function UpdateData(MetricName,Expected)
 {
     AgileMetric.findOne({"MetricName":MetricName},function(err,doc) 
                 {
                     
                     if (err) { throw err; }
                     if(doc != null)
                     {
                        AgileMetric.findOneAndUpdate({"MetricName": MetricName}, {$set: {"Expected":Expected}},  function(err,doc) {
                                                      if (err) { throw err; }
                                                      else {
                                                             return "Updated: " + MetricName;
                                                           }
                                                      });
                     }
                     else
                     {
                        AgileMetric.insertMany({"MetricName": MetricName,"Expected":Expected},  function(err,doc) {
                                                      if (err) { throw err; }
                                                      else {
                                                             return "Inserted: " + MetricName;
                                                                                                                        //   return "Inserted: " + MetricName;
                                                           }
                                                       });
                     }
                });
   
 }
async function GetData()
{
    var result=[];
   await AgileMetric.find(function(err,doc) 
   {
        if (err) { throw err; }
    
        if(doc != null)
        {
            for(var i =0 ; i < doc.length; i ++)
            {
            result.push(doc[i].Expected);
            }
        }
   });
   return result;
}
async function GetProjectData()
{
    var result=[];
   await AzureConnection.find(function(err,doc) 
   {
        if (err) { throw err; }
    
        if(doc != null)
        {
            for(var i =0 ; i < doc.length; i ++)
            {
            result.push(doc[i]);
            }
            
        }
   });
   return result;

}

module.exports.UpdateData=UpdateData;
module.exports.GetData=GetData;
module.exports.GetProjectData=GetProjectData;
