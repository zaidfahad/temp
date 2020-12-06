const express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const apirequest=require('request-promise')
const { request, response } = require('express');
const fs=require('fs');
var appRoot = require('app-root-path');

router.post('/createboard',async(request,response)=>{
var result=null;
console.log(request.body)
baseUrl=process.env.MiroBoardBaseUrl;
var nameOfBoard=request.body.boardname;
var description=request.body.description;
var sharingpolicy=request.body.sharingpolicy;
var teampolicy=request.body.teampolicy;
token=process.env.MiroToken;
 let url = baseUrl+'/boards';
 url = baseUrl+'/boards';
let options = 
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer '+token
  },
  body: '{"name":"'+nameOfBoard+'","sharingPolicy":{"access":"'+sharingpolicy+'","teamAccess":"'+teampolicy+'"},"description":"'+description+'"}'
};
var result= await CallMiroApi(url,options);
console.log(result)
if(JSON.parse(result).status!=undefined)
{
//AppendDataToFile(JSON.parse(result));
response.status(JSON.parse(result).status).send(result);
}else{
    response.status(200).send(result);
}
})
 
router.post('/sharedboardwithteammates/:id',async(request,response)=>{

  baseUrl=process.env.MiroBoardBaseUrl;
  var emails=request.body.emails;
  var teamInvitationStrategy=request.body.teamInvitationStrategy;
  var message=request.body.message;
  var role=request.body.role;
  token=process.env.MiroToken;
  var id=request.params['id'];
  //console.log(data)
  console.log(id);
  console.log(token)
   let url ='';
   url = baseUrl+'/boards/'+id+'/share';
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer '+token
    },
    body: '{"emails":"'+emails+'","teamInvitationStrategy":"'+teamInvitationStrategy+'","message":"'+message+'","role":"'+role+'"}'
  };
   //url = 'https://api.miro.com/v1/boards/o9J_ld5DDMA%3D/share';
    console.log(url)
   options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer '+token
    },
    body: '{"emails":["khanzaid2490@gmail.com"],"teamInvitationStrategy":"off","role":"editor","message":"Hello Zaid Ahmad Khan Indian test Message"}'
  };
  var result= await CallMiroApi(url,options);
  console.log(result)
  if(JSON.parse(result).status!=undefined)
  {
  response.status(JSON.parse(result).status).send(result);
  }else{
      response.status(200).send(result);
  }
  })

 async function CallMiroApi(url,options) {
    return new Promise(function(resolve, reject) {
      try{
      apirequest(url,options, function(err, resp, body) {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      })
    }catch(e){
        reject(e);
    }
    })
}
  

module.exports = router;
