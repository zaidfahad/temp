var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var mongoose = require('mongoose');
const Users = require('../models/Users')
/**Azure Api */
var nodeApi = require('azure-devops-node-api');
var WorkItemTrackingApi = require('azure-devops-node-api/WorkItemTrackingApi')
var CoreApi = require('azure-devops-node-api/CoreApi')
var WorkItemTrackingInterfaces = require('azure-devops-node-api/interfaces/WorkItemTrackingInterfaces')
var CoreInterfaces = require('azure-devops-node-api/interfaces/CoreInterfaces')

/** End Azure Api */


router.get('/getApiCall', async (req,res)=>{
    console.log('Hit get api');
    try{
        await getGitlabUsers(newDoc, gitlabURL, HTTPRequestOptions, gitlabGroup);
    }catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
    }
});


module.exports = router;


