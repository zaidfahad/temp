var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var mongoose = require('mongoose');
const ReferenceWorkItem = require('../models/ReferenceWorkItem');
const baseUrl = require('../models/BaseUrl');
const { Console } = require('winston/lib/winston/transports');
const { json } = require('body-parser');

azureProjectDetails=[{ name: 'https://lntinfotech.com', organization: [ {name: 'L&T Infotech', project: ['Implementation', 'Web Application', 'Support']} ] },{ name: 'https://dev.azure.com', organization: [ {name: 'TestCollaboration', project: ['Collaboration', 'Drilling', 'Oil Fields']} ] },{ name: 'https://lntconstruction.com', organization: [ {name: 'L&T Construction', project: ['Highways', 'Roads', 'Townships']} ] },{ name: 'https://lnttechnology.com', organization: [ {name: 'LNT Technology', project: ['AI/ML', 'Research', 'Development']} ] },{ name: 'Other'}];

router.get('/BaseUrl', async (req,res)=>{
    console.log('Hit BaseUrl api');
    try{
        //var baseUrlList= await baseUrl.find();
        var token = req.header('Authorization');
        console.log(req.header('Access-Control-Allow-Methods'));
        console.log(req.header('Access-Control-Allow-Origin'))
        console.log(token)
        res.status(200).send(azureProjectDetails);
    }catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/AllReferenceWorkItem', async (req, res) => {
    try{
        let data=  await ReferenceWorkItem.find();
        res.status(200).send(data.length != 0? data:"no Data");
    }
    catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching Data");
    }
    

})

router.post('/AddReferenceWorkItem', async (req, res) => {
    try{
        let BaseUrl = req.body.BaseUrl;
        let Organization = req.body.Organization;
        let Project = req.body.Project;
        let WorkItemList = JSON.stringify(req.body.WorkItemList);
         
        console.log('call service');
        var azdev = require("azure-devops-node-api");
        var orgUrl = req.body.BaseUrl +'/' + req.body.Organization;//"https://dev.azure.com/MyOrganizatio";
        var projectName = req.body.Project;//"FlexPay";
         //Zaid Token is here 
        var token = "4eljmqfrqhavxzbnsmjpbgc3wjwkypty3cstcajbjvsmzaspyxla";//q6ubvjtqtkqizsqx7v3xsk4omkxg4c2ok5a5fnhq7myrfvjoqvba";//"ouvsbyumq75zyquiorz5aakcmzqxgntmlnmje6smzucfz67sdn2a"; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
        var authHandler = azdev.getPersonalAccessTokenHandler(token); 
        console.log(req.body);
    
        //code working till here
        
        var connection = new azdev.WebApi(orgUrl, authHandler); 
        //issue with connection.getWorkItemTrackingApi();  
        var witApi = await connection.getWorkItemTrackingApi();
       
        var coreApiObject = await connection.getCoreApi();
       
        var project = await coreApiObject.getProject(projectName);
        
        
        let data= req.body.WorkItemList;
        console.log(data)
        var EpicArray = [];
        var FeatureArray = [];
        let Epicmap = new Map();
        let Featuremap = new Map();
     
        for(var idx of data) 
        {
            var value = idx;

            if(Epicmap.get(value.epic) == null) {
                //console.log("INSERT Epic" + value.epic); 
                var id = await addWorkItem(witApi, projectName, "Epic", "add", value.epic);
                Epicmap.set(value.epic, id)
            }
            if(Featuremap.get(value.feature) == null) {
                //console.log("INSERT Feature" + value.feature); 
                var id = await addWorkItem(witApi, projectName, "Feature", "add", value.feature);
                Featuremap.set(value.feature, id)
            }
            var id = await addWorkItem(witApi, projectName, "User Story", "add", value.userStory);
            //console.log("INSERT Story" + value.userStory + " ID = " + id); 
            await updateWorkItem(witApi, projectName, orgUrl, Epicmap.get(value.epic), Featuremap.get(value.feature));
            await updateWorkItem(witApi, projectName, orgUrl, Featuremap.get(value.feature), id);
        }
        res.status(200).send({ "status": "Successfully Updated" });
    }
    catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send(e);
    }
    

})



async function addWorkItem(witApi, projectName, workitemtype, operation, value) {
    //console.log('---addWorkItem----')
    var header = {};
    var wijson = [{ "op": operation, "path": "/fields/System.Title", "value": value }];
    var witype = workitemtype;    
    var newworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);
    //console.log('---newworkItemID----' + newworkItemID)
    //console.log(newworkItemID.id);
    return newworkItemID.id;
}
async function updateWorkItem(witApi, projectName, orgUrl, srcID, tgtID) {
    var targetURL = orgUrl + "/_apis/wit/workItems/" + tgtID;
    var header = {};
    var updatelinkjson = [{
        "op": "add",
        "path": "/relations/-",
        "value": {
          "rel": "System.LinkTypes.Dependency-forward",
          "url": targetURL,
          "attributes": {
            "comment": "Making a new link for the dependency from nodejs"
          }
        }
      }];
    var test1 = await witApi.updateWorkItem(header, updatelinkjson, srcID, projectName );
}



 module.exports = router;