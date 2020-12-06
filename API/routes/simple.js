var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var mongoose = require('mongoose');
const ReferenceWorkItem = require('../models/ReferenceWorkItem');
const baseUrl = require('../models/BaseUrl');
const { Console } = require('winston/lib/winston/transports');

router.get('/ReferenceWorkItem2', async (req,res)=>{
    try{
        console.log('call service');
        var azdev = require("azure-devops-node-api");
        var orgUrl = "https://dev.azure.com/MyOrganizatio";
        var token = "ouvsbyumq75zyquiorz5aakcmzqxgntmlnmje6smzucfz67sdn2a"; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
        var authHandler = azdev.getPersonalAccessTokenHandler(token); 
        var connection = new azdev.WebApi(orgUrl, authHandler); 
        var projectName= "FlexPay";
        var witApi = await connection.getWorkItemTrackingApi();
        var coreApiObject = await connection.getCoreApi();
        var project = await coreApiObject.getProject(projectName);
        console.log("Project ID is : " + project.id);
        // Read JSON data
        //const fs = require('fs');

        //let rawdata = fs.readFileSync('D://sample.json');

        //let data = JSON.parse(rawdata);
       

        let data=  await ReferenceWorkItem.find();
        
        var EpicArray = [];
        var FeatureArray = [];
        let Epicmap = new Map();
        let Featuremap = new Map();
        for(var idx of data) {
            //var item = data[idx];
            var value = idx;
            //console.log("value = " + value);
            //for(var key in item) {
                //var value = item[key];
                //console.log(value); 
                if(Epicmap.get(value.epic) == null) {
                    console.log("INSERT Epic" + value.epic); 
                    var id = await addWorkItem(witApi, projectName, "Epic", "add", value.epic);
                    Epicmap.set(value.epic, id)
                }
                if(Featuremap.get(value.feature) == null) {
                    console.log("INSERT Feature" + value.feature); 
                    var id = await addWorkItem(witApi, projectName, "Feature", "add", value.feature);
                    Featuremap.set(value.feature, id)
                }
                var id = await addWorkItem(witApi, projectName, "User Story", "add", value.userStory);
                console.log("INSERT Story" + value.userStory + " ID = " + id); 
                await updateWorkItem(witApi, projectName, orgUrl, Epicmap.get(value.epic), Featuremap.get(value.feature));
                await updateWorkItem(witApi, projectName, orgUrl, Featuremap.get(value.feature), id);
           
           //}
      }
       res.status(200).send(data.length != 0? data:"no Data");
    }
    catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
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