const express= require('express');
var router = express.Router();
var winston = require('../config/winston');
//require('dotenv').config();
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
var bodyParser = require('body-parser');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var sw = require('stopword');
const countWordsArray = require("count-words-array");
const { process } = require('natural/lib/natural/phonetics/soundex');
//app.use(bodyParser.json());

//var app1 = {};
/////////////////////////////**************************************************************************************************** */


  

router.post('/CreateChannels',(req,res)=>
{
var token=req.header('Authorization');
var teamID=req.body.teamID;
var channelNameList=req.body.channelsList;

///teams/{id}/channels
var client=MSGraphClient(token);
var url='/teams/'+teamID+'/channels';

for(var i=0;i<channelNameList.length;i++)
{

var bodyData 
=
{
    "displayName": channelNameList[i],
    "description": channelNameList[i],
    "membershipType": "standard"
};

client.api(url).post(bodyData).then((result) => {
return res.send(result)
}).catch((error) 
=> 
{
    console.log("Error", error);
    return res.send(error)
})
}
/*
///  Index Channels
*/
})


function MSGraphClient(token)
{
    var client = graph.Client.init
    ({
        authProvider: (done) => {
          done(null, token);
        }
    })
    return client;
}

module.exports = router;
