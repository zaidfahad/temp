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
    router.get('/membersofteams/:TeamsID',(req,res)=>
    {
    var token=req.header('Authorization');
    
    var TeamsID=req.params['TeamsID'];
    var client=MSGraphClient(token);
    var url='/groups/'+TeamsID+'/members';
    console.log(url)
   client.api(url).get().then((result) => {
    console.log(result)     
    return res.send(result)
    }).catch((error) => {
        console.log("Error", error);
        return res.send(error)
   }) 
   })


router.get('GetAppCatalog',async(request,response)=>
{
var client =MSGraphClient(token);
    ///appCatalogs/teamsApps
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
