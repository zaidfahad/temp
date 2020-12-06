const express= require('express');
var router = express.Router();
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
var bodyParser = require('body-parser');

/*
***
 * 
 * https://graph.microsoft.com/v1.0/groups/{teamID}/members
 * https://graph.microsoft.com/v1.0/groups/{group-id-for-teams}/members
 * https://graph.microsoft.com/v1.0/me/
 * https://graph.microsoft.com/v1.0/me/joinedTeams
 * **/
    router.get('/findinstalled/appcatalogs/:appname',(req,res)=>
    {
    var token=req.header('Authorization');
    
    var appname=req.params['appname'];
    var client=MSGraphClient(token);
    var url='/appCatalogs/teamsApps';
    console.log(url)
   client.api(url).get().then((result) => {
    for(var i = 0; i<  result.value.length; i++){
        if(appname!=undefined){
        if(result.value[i].displayName.toLowerCase()==appname.toLowerCase())
        {
            return res.status(200).send(result.value[i]);
        }
      }else
      {
        return res.status(200).send(result);
      }
    }
    }).catch((error) => {
        console.log("Error", error);
        return res.status(500).send(error);
       }) 
   })


router.post('/InstallAppByID',(req,res)=>
{
var token=req.header('Authorization');
var teamID=req.body.teamID;
var appID=req.body.appID;
var bodyData =
{
    "teamsApp@odata.bind":"https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/"+appID
};
var client=MSGraphClient(token);
var url='/teams/'+teamID+'/installedApps';
console.log(url)
client.api(url).post(bodyData).then((result) => {
    console.log(result)
 return res.statuscode(201).send('Application is installed succesfully')
}).catch((error) => {
    console.log("Error", error);
    return res.send(error)
})

})


router.post('/ListTab',(req,res)=>
{
var token=req.header('Authorization');
var TeamID=req.body.TeamID;
var ChannelID=req.body.ChannelID;
var client=MSGraphClient(token);
var url='/teams/'+TeamID+'/channels/'+ChannelID+'/tabs';
console.log(url)
client.api(url).get().then((result) => {
return res.send(result)
}).catch((error) => {
    console.log("Error", error);
    return res.send(error)
})

})
//https://graph.microsoft.com/v1.0/teams/{id}/channels/{id}/tabs


router.post('/AddTab',(req,res)=>
{
var token=req.header('Authorization');
var teamID=req.body.teamID;
var channelID=req.body.channelID;
var appID=req.body.appID;
var displayName=req.body.displayName;
var client=MSGraphClient(token);
var url='/teams/'+teamID+'/channels/'+channelID+'/tabs';
bodyData=
{
    "displayName": displayName,
    "teamsApp@odata.bind" : "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/"+appID,
    "configuration": {
      "entityId": "null",
      "contentUrl": "",
      "websiteUrl": "",
      "removeUrl": ""
    }
  }

client.api(url).post(bodyData).then((result) => {
return res.send(result)
}).catch((error) => {
    console.log("Error", error);
    return res.send(error)
})

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