var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var mongoose = require('mongoose');
const ReferenceWorkItem = require('../models/ReferenceWorkItem');
const baseUrl = require('../models/BaseUrl');
const { Console } = require('winston/lib/winston/transports');

router.get('/ReferenceWorkItem1', async (req,res)=>{
    console.log('Hit ReferenceWorkItem api');
    try{
        var WorkItemList= await ReferenceWorkItem.find();
        //var myWorkItem = JSON.parse(WorkItemList);
        //console.log(myWorkItem);
        console.log('---------Start duplicate----------');

        const values = [{id: 10, name: 'someName1'}, {id: 12, name: 'someName5'}, {id: 11, name:'someName3'}, {id: 12, name: 'someName4'},{id: 10, name: 'someName2'}];

        const lookup = values.reduce((a, e) => {
        a[e.id] = ++a[e.id] || 0;
        return a;
        }, {});

        const EpicTest =['Epic1#12','Epic2#876'];
        const items = ['item 1', 'thing', 'id-3-text', 'class'];
        //const matches = items.filter(s => s.includes('thin'));
        const matches = EpicTest.filter(s => s.includes('Epic1'));
        console.log("matches " + matches);
        console.log(values.filter(e => lookup[e.id]));
        //var test = values.reduce();
        //console.log('indexOF' + test);
        console.log('---------End for----------');


        var AllEpicList = [];
        var AllFeatureList = [];
        var AlluserStory = [];
             Object.entries(WorkItemList).forEach(([key, value]) => {
               
                //value.forEach((a,b)=>{console.log("1")})
                value['epic'];
                AllEpicList.push(value['epic']);
                AllFeatureList.push(value['feature']);
                AlluserStory.push(value['userStory']);
                //console.log('---------End----------');
              });
              console.log('Added');
              //console.log(AllEpicList);
              const DupRemoveEpic = AllEpicList.filter((item,index)=>AllEpicList.indexOf(item) === index);         
              const DupRemoveFeature = AllFeatureList.filter((item,index)=>AllFeatureList.indexOf(item) === index);
              //console.log('Remove Duplicate');
              //console.log(DupRemoveEpic,DupRemoveFeature,AlluserStory);
              

              DupRemoveEpic.forEach((item)=>{
                //run(item,);
                AddJsonData(WorkItemList);
              });
       
        
        
        res.status(200).send(WorkItemList.length != 0? WorkItemList:"no Data");
    }catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
    }
});

const AddJsonData = async function ( WorkItemList) {
    console.log("Run Hit");
    //console.log(DupRemoveEpicList);
    try{
        var azdev = require("azure-devops-node-api");
        // your collection url
        var orgUrl = "https://dev.azure.com/MyOrganizatio";
        //var orgUrl = "https://dev.azure.com/<Organisation>";
        var token = "ouvsbyumq75zyquiorz5aakcmzqxgntmlnmje6smzucfz67sdn2a"; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
        var authHandler = azdev.getPersonalAccessTokenHandler(token); 
        var connection = new azdev.WebApi(orgUrl, authHandler); 
        //console.log(connection);
        var build = await connection.getBuildApi();
        //var projectName= "BookRollOver";

        var projectName= "FlexPay";

        var defs = await build.getDefinitions(projectName);
        defs.forEach((defRef) => {
            console.log(`${defRef.name} (${defRef.id})`);
        });    
        var witApi = await connection.getWorkItemTrackingApi();
        var coreApiObject = await connection.getCoreApi();
        var project = await coreApiObject.getProject(projectName);
        console.log("Project ID is : " + project.id);
        const workItemTypes = await witApi.getWorkItemTypes(project.id);
        console.log('Work item types:', workItemTypes.map((item) => item.name));
        var epidID = 0;
        var FeatureID = 0;
        var userStoryID =0;
        var OldEpicID = 0;
        var epicNameOld = "";
        var EpicList=[];
        //let scores :number[] = [10, 20, 30, 40];  
           
        
        //Object.entries(WorkItemList).forEach(([key, value]) => {
        Object.entries(WorkItemList).forEach(async([key, value]) => {
            var currentEpic = value['epic'] ;
            console.log('currentEpic ' + currentEpic);
            console.log('-----Count Item----');
            console.log("EpicList Initial" + EpicList.length);
            //EpicList=['Pre-Planning#111'];
            //console.log("EpicList Added" + EpicList.length);
            EpicList.forEach((i,Count)=>{console.log("EpicList contain =>"+i)})
            console.log("WorkItem " + value['epic'] + " " + value['feature']);
            //EpicList.filter(s=>s.includes());
            var  matchesEpic =  EpicList.filter(s => s.includes(currentEpic));
           
            //const matchesEpic = EpicList.filter(s => s.includes(value['epic']));
            console.log("matchesEpic " + matchesEpic);
            var epicNameNew = value['epic'];
            
              if(matchesEpic == "") 
              {
                //New Epic
                console.log('---New Epic---')
                EpicList.forEach((i,Count)=>{console.log("List Old Epid=>" + i)})
                //console.log("EpicListPush" + EpicList);
                // //EpicList.push('Pre-palning' + "#" + 1111);//
                // //OldEpicID = matchesEpic.split('#')[1];
                // //var OldEpicID11 = value['epic'].split('#');
                // //OldEpicID11.forEach((itemEpic) =>{console.log("ItemList" + itemEpic);})
                // //console.log("OldEpicID =" + OldEpicID);
                epicNameOld = currentEpic;
                console.log('Update EpicList=>' + epicNameOld)
                var header = {};
                var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": currentEpic }];
                var witype = "Epic";
                //var newworkItemID =  witApi.createWorkItem(header, wijson, projectName, witype);
                var newworkItemID =  await witApi.createWorkItem(header, wijson, projectName, witype);
                epidID = newworkItemID.id;
    
                console.log("EpicID=" + epidID);

                EpicList.push( currentEpic + "#" + epidID);
                //EpicList.pop();
                EpicList.forEach((i,Count)=>{console.log("push=>" + i)})
                OldEpicID = epidID;
                console.log("OldEpicID =" + epidID);

                // var featureName = value['feature'];
                // //var header = {};
                // var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": value['feature'] }];
                // var witype = "Feature";
                // var featureworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);
                // fetureID = featureworkItemID.id;
                // //console.log("fetureID=>" + fetureID)
                // var userStoryName = value['userStory'];

                //var header = {};
                // var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": value['userStory'] }];
                // var witype = "User Story";
                // var sotryPtworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);
                //console.log("User Story ID=>" + sotryPtworkItemID.id) ;

                // var orgUrlProject = "https://dev.azure.com/MyOrganizatio/FlexPay";
                // //console.log(orgUrlProject);
                // var workItem113 = await witApi.getWorkItem(id=fetureID);
                // var updatelinkjson = [{
                //     "op": "add",
                //     "path": "/relations/-",
                //     "value": {
                //     "rel": "System.LinkTypes.Dependency-forward",
                //     "url": orgUrlProject +  "/_apis/wit/workItems/" + fetureID,
                //     "attributes": {
                //         "comment": "Making a new link for the dependency from nodejs"
                //     }
                //     }
                // }];
                // var test1 = await witApi.updateWorkItem(header, updatelinkjson, epidID, projectName );
                //var test1 = await witApi.updateWorkItem(header, updatelinkjson, 474, projectName );
                //console.log(test1);
                
              }
              else{
                  //Epic present 
                //   console.log('Epic present OldEpicID=> ' +  OldEpicID);
                //   var featureName = value['feature'];
                //   //var header = {};
                //   var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": value['feature'] }];
                //   var witype = "Feature";
                //   var featureworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);
                //   fetureID = featureworkItemID.id;

                //   var orgUrlProject = "https://dev.azure.com/MyOrganizatio/FlexPay";
                //console.log(orgUrlProject);
                // var workItem113 = await witApi.getWorkItem(id=fetureID);
                // var updatelinkjson = [{
                //     "op": "add",
                //     "path": "/relations/-",
                //     "value": {
                //     "rel": "System.LinkTypes.Dependency-forward",
                //     //
                //     "url": orgUrlProject +  "/_apis/wit/workItems/" + fetureID,
                //     "attributes": {
                //         "comment": "Making a new link for the dependency from nodejs"
                //     }
                //     }
                // }];
                //var test1 = await witApi.updateWorkItem(header, updatelinkjson, OldEpicID, projectName );
                //var test1 = await witApi.updateWorkItem(header, updatelinkjson, 474, projectName );
                //console.log(test1);
                //EpicList.push( epicNameNew + "#" + epidID);
                
              }
            //value.forEach((a,b)=>{console.log("1")})
            
          });


        
        

        
    }
    catch(e){
        console.log(e);
    }
   


}
var  witApi;
var epidID;
var EpicList=[];
var FeatureList=[];
var currentEpic;
const timeout = ms => new Promise(res => setTimeout(res, ms));
router.get('/ReferenceWorkItem', async (req,res)=>{
    console.log('Hit ReferenceWorkItem api');
    try{
            var WorkItemList= await ReferenceWorkItem.find().or([{ sNo: "1" }, { sNo: "2" }]);//find();
            
            var azdev = require("azure-devops-node-api");
            // your collection url
            var orgUrl = "https://dev.azure.com/MyOrganizatio";
            //var orgUrl = "https://dev.azure.com/<Organisation>";
            var token = "ouvsbyumq75zyquiorz5aakcmzqxgntmlnmje6smzucfz67sdn2a"; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
            var authHandler = azdev.getPersonalAccessTokenHandler(token); 
            var connection = new azdev.WebApi(orgUrl, authHandler); 
            //console.log(connection);
            var build = await connection.getBuildApi();
            //var projectName= "BookRollOver";

            var projectName= "FlexPay";

            var defs = await build.getDefinitions(projectName);
            defs.forEach((defRef) => {
                console.log(`${defRef.name} (${defRef.id})`);
            });    
             witApi = await connection.getWorkItemTrackingApi();
            var coreApiObject = await connection.getCoreApi();
            var project = await coreApiObject.getProject(projectName);
            console.log("1....Project ID is : " + project.id);

            ///////////////////////
            const timeout = ms => new Promise(res => setTimeout(res, ms));

            Object.entries(WorkItemList).forEach(async([key, value]) => {
                currentEpic = value['epic'] ;
                console.log("2...Loop Start");
                var  matchesEpic =  EpicList.filter(s => s.includes(currentEpic));
                console.log("matchesEpic = " + matchesEpic);
                if(matchesEpic == ""){

                      var NewEpicID = await  AddWorkItem('Epic','FlexPay',value['epic']);
                      //await timeout(9000);
                      //var NewFetureID  = AddWorkItem('Feature','FlexPay',value['feature']);
                      //var NewUserStoryID = AddWorkItem('User Story','FlexPay',value['userStory']);
                      //Add Dependency
                        //   await LinkItemDependency(NewEpicID,NewFetureID,projectName);
                        //   await LinkItemDependency(NewEpicID,NewFetureID,projectName);
                }
                else{
                    //var NewFetureID  = AddWorkItem('Feature','FlexPay',value['feature']);
                    //var NewFetureID  = AddWorkItem('User Story','FlexPay',value['userStory']);
                    //Add Dependency
                    // await LinkItemDependency(NewEpicID,NewFetureID,projectName);
                    // await LinkItemDependency(NewEpicID,NewFetureID,projectName);
                }

                console.log("3...Loop End");
            });
                
        res.status(200).send(WorkItemList.length != 0? WorkItemList:"no Data");
    }
    catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
    }
});
//async function AddWorkItem(witype,projectName,CurrentItemText){//today
    const AddWorkItem = async(witype,projectName,CurrentItemText) => {
      try{
        console.log("------ 2.1.Call AddWorkItem----");
            //console.log("WiType==" + witype);

            if(witype = 'Epic'){
                console.log('2.2.Start Epic if-else AddWorkItem')
                epicNameOld = currentEpic;
                console.log('OldEpic & currentEpic Name=>' + epicNameOld)
                var header = {};
                var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": currentEpic }];
                var witype = "Epic";
                console.log("2.3.Start Api Call ");
                var newworkItemID =  await witApi.createWorkItem(header, wijson, projectName, witype); //Today
                //var newworkItemID =   witApi.createWorkItem(header, wijson, projectName, witype);
                //await timeout(6000);
                console.log("2.4.End Api Call newworkItemID" + newworkItemID.id);
                epidID = newworkItemID.id;
                //EpicList.forEach((i,Count)=>{console.log("2.5 Old EpicList =>"+i)})
                EpicList.push( currentEpic + "#" + epidID);
                //EpicList.forEach((i,Count)=>{console.log("2.6 New EpicList =>"+i)});
                console.log('2.5.End Epic if-else AddWorkItem')
                return epidID; 
            }
            else if(witype = 'Feature'){

                //
            }
            else if(witype = 'User Story'){

                //
            }


      
            
      }
      catch(e){
        winston.error(e);
        console.log(e);
        //res.status(500).send("Error while fetching aks cluster");
      }
    
}

async function LinkItemDependency(parentID,childID,projectName){
    try{
            var orgUrlProject = "https://dev.azure.com/MyOrganizatio/FlexPay";
            //console.log(orgUrlProject);
            //var workItem113 = await witApi.getWorkItem(id=fetureID);
            var header = {};
            var workItem113 = await witApi.getWorkItem(id=childID);
            var updatelinkjson = [{
                "op": "add",
                "path": "/relations/-",
                "value": {
                "rel": "System.LinkTypes.Dependency-forward",
                //"url": orgUrlProject +  "/_apis/wit/workItems/" + fetureID,
                "url": orgUrlProject +  "/_apis/wit/workItems/" + childID,
                "attributes": {
                    "comment": "Making a new link for the dependency from nodejs"
                }
                }
            }];
            //var test1 = await witApi.updateWorkItem(header, updatelinkjson, epidID, projectName );
            var test1 = await witApi.updateWorkItem(header, updatelinkjson, parentID, projectName );
    }
    catch(e){
        winston.error(e);
        console.log(e);
    }

}


 
// router.post('/AddUser', async (req,res)=>{
//     console.log('Hit POst api');
//     var user_data = req.body;
//     try{
//         await Users.findOneAndUpdate(
//             {
//                 "user_id": user_data.user_id
//             },
//             {
//                 $set: user_data
//             },
//             {
//                 new: true,
//                 upsert: true
//             });

//         res.status(200).send({ "Status": "User added" });
//     }catch(e){
//         //winston.error(e);
//         console.log(e);
//         res.status(500).send("Error while fetching aks cluster");
//     }
// });

// router.get('/BaseUrl', async (req,res)=>{
//     console.log('Hit BaseUrl api');
//     try{
//         var baseUrlList= await baseUrl.find();
//         console.log(baseUrlList);
//         res.status(200).send(baseUrlList.length != 0? baseUrlList:"no Data");
//     }catch(e){
//         winston.error(e);
//         console.log(e);
//         res.status(500).send("Error while fetching aks cluster");
//     }
// });

module.exports = router;