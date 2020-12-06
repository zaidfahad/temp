var timespan = require('timespan');
var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var AgileMetric = require('../models/agile_metric');
var azdev = require("azure-devops-node-api");
const { Console } = require('winston/lib/winston/transports');
const { WorkItemTrackingApi } = require('azure-devops-node-api/WorkItemTrackingApi');
const { TreeStructureGroup } = require('azure-devops-node-api/interfaces/WorkItemTrackingInterfaces');

router.post('/AgileMetric', async (req,res)=>{
  try{
     var requestData = req.body.Data;
     if(requestData == "Submit")
     {
        ///Request Parameters-- Expected Value
        var saveVelocity = req.body.Velocity;
        var saveLeadTime= req.body.LeadTime;
        var saveCycleTime=req.body.CycleTime;
        var saveThroughPut= req.body.ThroughPut;
        var saveBlockedTime= req.body.BlockedTime;
        var saveWorkItemAge=req.body.WorkItemAge;  
        var saveFlowEfficiency= req.body.FlowEfficiency;
        var saveBacklogReadiness= req.body.BacklogReadiness;
        var savePercentComplete= req.body.PercentComplete;
        await SaveData(saveVelocity,saveLeadTime,saveCycleTime,saveThroughPut,saveBlockedTime,saveWorkItemAge,saveFlowEfficiency,saveBacklogReadiness,savePercentComplete);
        
        res.json('Success');
    }
    else
    {
        //Expectedvalue comes from Database
        var data =[];
        data =  await AgileMetric.GetData();
        if(data.length > 0 )
        {
          var expectedVelocity = data[0];
          var expectedLeadTime = data[1];
          var expectedCycleTime = data[2];
          var expectedThroughPut = data[3];
          var expectedBlockedTime = data[4];
          var expectedWorkItemAge = data[5];
          var expectedFlowEfficiency = data[6];
          var expectedBacklogReadiness = data[7];
          var expectedPercentComplete = data[8];
        }
       
        ///Actual Value :- reading  from azure devops
        var workItems = await AzureConnect();
        var averageVelocity = await Velocity(workItems);
        var averageLeadTime = await LeadTime(workItems);
        var averageCycleTime = await CycleTime(workItems);
        var averageThroughPut = await ThroughPut(workItems);
        var averageBlockingTime = await BlockedTime(workItems);
        var averageWorkItemAge = await WorkItemAge(workItems);
        if(isNaN(averageBlockingTime))
        {
          averageBlockingTime = 0;
        }
        if(isNaN(averageWorkItemAge))
        {
          averageWorkItemAge = 0;
        }
        var averageFlowEfficiency = await FlowEfficiency(workItems,averageCycleTime);
        if(isNaN(averageFlowEfficiency))
        {
          averageFlowEfficiency = 0;
        }
        var averageBacklogReadiness = await BacklogReadiness(workItems,averageVelocity);
        var averagePercentComplete = await PercentComplete(workItems); 
        
        
        // // Compare values between expected and average
        var velocityColor = await GetColor(averageVelocity,expectedVelocity);
        var leadTimeColor = await GetColor(averageLeadTime,expectedLeadTime);
        var cycleTimeColor = await GetColor(averageCycleTime,expectedCycleTime);
        var throughPutColor = await GetColor(averageThroughPut,expectedThroughPut);
        var blockedTimeColor = await GetColor(averageBlockingTime,expectedBlockedTime);
        var workItemAgeColor = await GetColor(averageWorkItemAge,expectedWorkItemAge);
        var flowEfficiencyColor = await GetColor(averageFlowEfficiency,expectedFlowEfficiency);
        var backlogReadinessColor = await GetColor(averageBacklogReadiness,expectedBacklogReadiness);
        var percentCompleteColor = await GetColor(averagePercentComplete,expectedPercentComplete);
        // // response 
       
         var resultData = [];
         resultData = [{"MetricName":"Sprint Velocity","Actual":averageVelocity,"Expected":expectedVelocity,"Color":velocityColor},
         {"MetricName":"Lead Time","Actual":averageLeadTime,"Expected":expectedLeadTime,"Color":leadTimeColor},
         {"MetricName":"Cycle Time","Actual":averageCycleTime,"Expected":expectedCycleTime,"Color":cycleTimeColor},
         {"MetricName":"ThroughPut","Actual":averageThroughPut,"Expected":expectedThroughPut,"Color":throughPutColor},
         {"MetricName":"Blocking Time","Actual":averageBlockingTime,"Expected":expectedBlockedTime,"Color":blockedTimeColor},
         {"MetricName":"WorkItem Age","Actual":averageWorkItemAge,"Expected":expectedWorkItemAge,"Color":workItemAgeColor},
         {"MetricName":"Flow Efficiency","Actual":averageFlowEfficiency,"Expected":expectedFlowEfficiency,"Color":flowEfficiencyColor},
         {"MetricName":"Backlog Readiness","Actual":averageBacklogReadiness,"Expected":expectedBacklogReadiness,"Color":backlogReadinessColor},
         {"MetricName":"Percent Complete","Actual":averagePercentComplete,"Expected":expectedPercentComplete,"Color":percentCompleteColor}];

         res.json(resultData);
    }
  }
  catch(e){
    winston.error(e);
    console.log(e);
    res.status(500).send("Error while fetching aks cluster");    
  }
});
async function SaveData(saveVelocity,saveLeadTime,saveCycleTime,saveThroughPut,saveBlockedTime,saveWorkItemAge,saveFlowEfficiency,saveBacklogReadiness,savePercentComplete)
{  
   await AgileMetric.UpdateData("Sprint Velocity",saveVelocity);
   await AgileMetric.UpdateData("Lead Time",saveLeadTime);
   await AgileMetric.UpdateData("Cycle Time",saveCycleTime);
   await AgileMetric.UpdateData("ThroughPut",saveThroughPut);
   await AgileMetric.UpdateData("Blocking Time",saveBlockedTime);
   await AgileMetric.UpdateData("WorkItem Age",saveWorkItemAge);
   await AgileMetric.UpdateData("Flow Efficiency",saveFlowEfficiency);
   await AgileMetric.UpdateData("Backlog Readiness",saveBacklogReadiness);
   await AgileMetric.UpdateData("Percent Complete",savePercentComplete);
}
async function AzureConnect()
{
    var resultProject =[];
    resultProject =  await AgileMetric.GetProjectData();
    var orgUrl = resultProject[0].OrgUrl;
    var token = resultProject[0].token; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
    var authHandler = azdev.getPersonalAccessTokenHandler(token); 
    var connection = new azdev.WebApi(orgUrl, authHandler); 
    var build = await connection.getBuildApi();
    var projectName= resultProject[0].ProjectName;
    var witApi = await connection.getWorkItemTrackingApi();
    //  const resultdata =  (await witApi.getClassificationNode(projectName,TreeStructureGroup.Iterations));
    //  //var keydata=[];
    //  for (let keydata of resultdata.children())
    //  {
    //    var attributeData=[];
    //    attributeData =keydata.attributes;
    //    console.log("Sprint Details:",attributeData["startDate"]);
    //  }
    var id_range =[];
    id_range = (await GetWorkItemIDs(witApi,projectName)).split(',');
    var workItems = await witApi.getWorkItems(id=id_range);
    return workItems;
}

async function Velocity(workItems)
{
    var sumofUserStorypoint = 0;
    var countWorkITem = workItems.length;
    
    var iterationName = [];
    iterationName = await GetIterationCount(workItems);
    for(let keyValues of workItems)
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
      {
         sumofUserStorypoint += keyValues.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
      }
    }
    return Math.ceil(sumofUserStorypoint/iterationName.length);
}
async function CycleTime(workItems)
{
    var countWorkItem = 0;
    var closedDate, activatedDate;
    var sumCycleTime;
    for (let keyValues of workItems)
    {
        if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
        {
            closedDate = new Date(keyValues.fields["Microsoft.VSTS.Common.ClosedDate"]);
            activatedDate = new Date(keyValues.fields["Microsoft.VSTS.Common.ActivatedDate"]);
            var cycleTime = timespan.fromDates(activatedDate, closedDate);
            if(sumCycleTime != null)
            {
              sumCycleTime = sumCycleTime + cycleTime.totalDays();
            }
            else
            {
              sumCycleTime = cycleTime.totalDays();
            }
            countWorkItem++;
        }
      }
      return  Math.ceil(sumCycleTime / countWorkItem);
}
async function LeadTime(workItems)
{
    var sumLeadTime; 
    var countWorkItem = 0;
    var closedDate, createdDate;
    for (let keyValues of workItems)
    {
        if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
        {
            closedDate = new Date(keyValues.fields["Microsoft.VSTS.Common.ClosedDate"]);
            createdDate = new Date(keyValues.fields["System.CreatedDate"]);
            var leadTime = timespan.fromDates(createdDate, closedDate);
         
            if(sumLeadTime != null)
            {
              sumLeadTime = sumLeadTime + leadTime.totalDays();
            }
            else
            {
              sumLeadTime = leadTime.totalDays();
            }
            countWorkItem++;
        }
      }
      return Math.ceil(sumLeadTime / countWorkItem);
}
async function ThroughPut(workItems)
{
    var countWorkItem = 0;
    var iterationName = [];
    iterationName = await GetIterationCount(workItems);
    for(let keyValues of workItems)
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
      {
        countWorkItem += countWorkItem;
      }
    }
    return Math.ceil(countWorkItem/iterationName.length);
}
async function BlockedTime(workItems)
{
    var countWorkItem = 0;
    var sumBlockingTime;
    var currentDate, activatedDate;
    for(let keyValues of workItems)
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Active" && keyValues.fields["Microsoft.VSTS.CMMI.Blocked"]== "Yes")
      {
         currentDate = new Date(Date.now());
         activatedDate = new Date(keyValues.fields["Microsoft.VSTS.Common.ActivatedDate"]);
         var blockTime = timespan.fromDates(activatedDate, currentDate);
         if(sumBlockingTime != null)
         {
          sumBlockingTime = sumBlockingTime + blockTime.totalDays();
         }
         else
         {
           sumBlockingTime = blockTime.totalDays();
         }
         countWorkItem++;
      }
    }
    return Math.ceil(sumBlockingTime/countWorkItem);
}
async function WorkItemAge(workItems)
{
   var sumWorkItemAge;
    var countWorkItem = 0;
    var currentDate, activatedDate;
    for(let keyValues of workItems)
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Active")
      {
        currentDate = new Date(Date.now());
        activatedDate = new Date(keyValues.fields["Microsoft.VSTS.Common.ActivatedDate"]);
        var workItemAge = timespan.fromDates(activatedDate, currentDate);
        if(sumWorkItemAge != null)
        {
          sumWorkItemAge=sumWorkItemAge + workItemAge.totalDays();
        }
        else
        {
          sumWorkItemAge = workItemAge.totalDays();
        }
        countWorkItem ++;
      }
    }
    return Math.ceil(sumWorkItemAge /countWorkItem);
}
async function FlowEfficiency(cycleTime,workItemAge)
{
  return Math.ceil( workItemAge / cycleTime) * 100;
}
async function BacklogReadiness(workItems,averageVelocity)
{
  var sumofUserStorypoint = 0;
  var countWorkITem = workItems.length;
    
    var iterationName = [];
    iterationName = await GetIterationCount(workItems);
    for(let keyValues of workItems)
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
      {
         sumofUserStorypoint += keyValues.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
      }
    }
    return Math.ceil(sumofUserStorypoint/averageVelocity);
}
async function PercentComplete(workItems)
{
  var sumofUserStorypoint=0;
  var sumofUserStorypointAll=0;
  var totalUserStorypoint=0;
 
  for(let keyValues of workItems)
  {
    var iteration = (keyValues.fields["System.IterationPath"]).substring(12,23);
    if(iteration == "Iteration 1")
    {
      if (keyValues.fields["System.WorkItemType"] == "User Story" && keyValues.fields["System.State"] == "Closed")
      {
        sumofUserStorypoint += keyValues.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
      }
      if (keyValues.fields["System.WorkItemType"] == "User Story")
      {
         sumofUserStorypointAll += keyValues.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
      }
      totalUserStorypoint = Math.ceil((sumofUserStorypoint/sumofUserStorypointAll)*100);
    }
  }
  return totalUserStorypoint;
}
async function GetColor(averagecolor,expectedColor)
{
  if(expectedColor >= averagecolor)
  {
    return greenColor = 'Green';
  }
  else
  {
    return redColor='Red';
  }
}
async function GetWorkItemIDs(witApi,projectName)
{
  var strWorkItemList='';
  var teamContext = {project:  projectName};//{project: teamProject, team: teamName };
  var wiqlQuery = {"query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'user story' AND ([System.TeamProject] = '"+projectName+"') order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"};
   
    await witApi.queryByWiql(wiqlQuery, teamContext).then(function(queryResult){
       var WorkItemList = JSON.stringify(queryResult["workItems"]); 
      
        queryResult.workItems.forEach(ele=>{
                strWorkItemList += ','+ele.id;
          }); 
          while( strWorkItemList.charAt( 0 ) === ',' ){
            strWorkItemList = strWorkItemList.slice( 1 );
          }
          strWorkItemList = strWorkItemList;
    }).catch(function(err){
        console.log("1.WIQL--" + err);
    });
    return strWorkItemList;
}
async function GetIterationCount(workItems)
{
  var iterationName = [];
  for(let keyValues of workItems)
  {
    var iteration = (keyValues.fields["System.IterationPath"]).substring(12,23);
    if(iterationName.length > 0)
    {
      let count  = iterationName.filter(s => s.includes(iteration));
      if(count.length == 0)
      {
         iterationName.push(iteration);
      }
    }
    else
    {
       iterationName.push(iteration);
    }
  }
  return iterationName;
}

 module.exports=router;




