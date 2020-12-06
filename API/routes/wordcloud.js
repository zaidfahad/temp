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


/**
 *  Get the teams in Microsoft Teams that the user is a direct member of.
 *  Requires Authorization - Bearer{token}.
 */
router.get('/myteam',(req,res)=>{
    try{
        var token = req.header('Authorization');
        var client = graph.Client.init({
                authProvider: (done) => {
                done(null, token);
                }
            })
                client.api('/me/joinedTeams').get().then((result) => {
                    //console.log("Sucess in retrieving team information", result)   
                    console.log(result)     
                    return res.send(result)
                        }).catch((error) => {
                            console.log("Error", error);
                            return res.send(error)
                    })
    }catch(e){
                return res.status(500).send(error)
            }
             })

/**
 * Retrieve the list of channels in this team.
 * Requires Authorization - Bearer{token}.
 * Requires Team ID
 * {
          "TeamsID":"5fxxxxxx-xxxx-xxxx-xxxxx-0000000000"
    }
 */
router.get('/mychannel/:TeamsID',(req,res)=>{
    try{
      var token=req.header('Authorization');
      
      var TeamsID=req.params['TeamsID'];
       
      var client = graph.Client.init({
            authProvider: (done) => {
            done(null, token);
            }
        })
            client.api('teams/'+TeamsID+'/channels').get().then((result) => {
            console.log("Sucess in retrieving channel information", result)
            return res.send(result)
            }).catch((error) => {
                console.log("Error", error);
                return res.send(error)
            });
    }
    catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching Data");
    }

    
})

/**
 * Retrieve the messages of the channels from a team.
 * Requires Authorization - Bearer{token}.
 * Requires Team ID, Channel ID
 * {
            "TeamsID":"5fxxxxxx-xxxx-xxxx-xxxxx-0000000000",
            "channelID":"19:xxxxxxxxxxxxxxxxxxxxxxxxxxxx@thread.tacv2"
    }
 */

  router.post('/mychanneldurationmsg',(req,res)=>{
    var token=req.header('Authorization');
    var CurrDate = new Date();
    var CalculetedDate =new Date();
    var TeamsID=req.body.TeamsID;
    var channelID=req.body.channelID;
    var wordFrequency = req.body.wordFrequency;
    var lastModifiedDateTime = req.body.lastModifiedDate;
    var client = graph.Client.init({    
        authProvider: (done) => {
        done(null, token);
        }
    })
    

        if (lastModifiedDateTime == "Month6")
        {
            CalculetedDate = new Date(CurrDate.setMonth(CurrDate.getMonth()-6));
            CalculetedDate = CalculetedDate.toISOString();
        }
        else if(lastModifiedDateTime == "Month3"){
            CalculetedDate = new Date(CurrDate.setMonth(CurrDate.getMonth()-3));
            CalculetedDate = CalculetedDate.toISOString();
        }
        else if(lastModifiedDateTime == "Month1"){
            CalculetedDate = new Date(CurrDate.setMonth(CurrDate.getMonth()-1));
            CalculetedDate = CalculetedDate.toISOString();
        }
        else if(lastModifiedDateTime == "Today"){
            CalculetedDate = new Date(CurrDate);
            CalculetedDate = CalculetedDate.toISOString();
        }
    
    
    
    
    client.api('https://graph.microsoft.com/beta/teams/'+TeamsID+'/channels/'+channelID+'/messages/delta?$filter=lastModifiedDateTime gt '+CalculetedDate).get().then((result) => {
    

            var msgString='';
            for(let i = 0; i<  result.value.length; i++){
                msgString = msgString.concat(result.value[i].body.content + " ");
                }
            //Stemming
            msgString = natural.PorterStemmer.stem(msgString);
            //Tokenizing
            tokenizer = new natural.TreebankWordTokenizer();
            msgString = tokenizer.tokenize(msgString);
            //Removing StopWords
            msgString = (sw.removeStopwords(msgString)).toString();
            //Word Count Array
            var arr = countWordsArray(msgString, true)
        
            let intermediateArray = arr.map(elm => ({ Name: elm.name, Weight: elm.count}));
        
                var resultArray = intermediateArray.filter(function( obj ) {
                    return obj.Weight > wordFrequency
                });
                return res.send(resultArray)
        }).catch((error) => {
        console.log("Error", error);
        return res.send(error)
        })

})



  
router.post('/CreateChannels',(req,res)=>
{
var token=req.header('Authorization');
var teamID=req.body.teamID;
var channelNameList=req.body.channelsList;
console.log(req.body)
///teams/{id}/channels
var client=MSGraphClient(token);
/*
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
