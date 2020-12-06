const express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const apirequest=require('request-promise')
const { request, response, Router } = require('express');
const fs=require('fs');
var appRoot = require('app-root-path');

router.post('/Authenticate',async(request,response)=>{
var result=null;
//console.log(request.body)
baseUrl=process.env.KahootBaseUrl;
var password=request.body.password;
var username=request.body.username;
 let url = baseUrl+'/rest/authenticate';

 let options = 
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body:  '{"username":"'+username+'","password":"'+password+'","grant_type":"password"}'
};
console.log(options)
var result= await CallAPI(url,options);
console.log(result)
if(JSON.parse(result).status!=undefined)
{
response.status(JSON.parse(result).status).send(result);
}
else
{
    response.status(200).send(result);
}
})
 

  

router.post('/draftspace',async(req,response)=>
{
    url='https://create.kahoot.it/rest/drafts';
    var token = req.body.token;
    var bodyData=process.env.kahootdraft;
    let options = 
   {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':token
  },
  body: bodyData
   };
   console.log(options)
var result= await CallAPI(url,options);
console.log(result)
if(JSON.parse(result).status!=undefined)
{
response.status(JSON.parse(result).status).send(result);
}
else
{
    response.status(200).send(result);
}
})



router.put('/SubmitGameInstance',async(req,response)=>
{
    
    var token = req.body.token;
    var bodyData=req.body.gamestructure;
    var folderID=req.body.folderID;
    url='https://create.kahoot.it/rest/drafts/'+folderID;
    let options = 
   {
  method: 'put',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':token
  },
  body: bodyData
   };
   console.log(options)
var result= await CallAPI(url,options);
console.log(result)
if(JSON.parse(result).status!=undefined)
{
response.status(JSON.parse(result).status).send(result);
}
else
{
    response.status(200).send(result);
}
})



router.post('/PublishGame',async(req,response)=>
{
    
    var token = req.body.token;
    var folderID=req.body.folderID;
    url='https://create.kahoot.it/rest/drafts/'+folderID+'/publish';
    let options = 
   {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':token
  },
  body: ''
   };
   console.log(options)
var result= await CallAPI(url,options);
console.log(result)
if(JSON.parse(result).status!=undefined)
{
response.status(JSON.parse(result).status).send(result);
}
else
{
    response.status(200).send(result);
}
})

 async function CallAPI(url,options) {
    return new Promise(function(resolve, reject) {
      try{
      apirequest(url,options, function(err, resp, body) {
        if (err) {
          reject(err);
        } else {
            console.log(body)
          resolve(body);
        }
      })
    }catch(e){
        reject(e);
    }
    })
}
  

module.exports = router;
