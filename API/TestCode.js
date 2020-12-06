async function run() {

 

    var azdev = require("azure-devops-node-api");

 

    var orgUrl = "https://dev.azure.com/MyOrganizatio";
    //var orgUrl = "https://dev.azure.com/<Organisation>";
    var token = "ouvsbyumq75zyquiorz5aakcmzqxgntmlnmje6smzucfz67sdn2a";// e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 

 

    var authHandler = azdev.getPersonalAccessTokenHandler(token); 

    var connection = new azdev.WebApi(orgUrl, authHandler); 

 

    var projectName= "FlexPay";

    

    var witApi = await connection.getWorkItemTrackingApi();

    var coreApiObject = await connection.getCoreApi();

    var project = await coreApiObject.getProject(projectName);

 

    console.log("Project ID is : " + project.id);

    

    // Read JSON data

 

    const fs = require('fs');

    let rawdata = fs.readFileSync('D://sample.json');

    let data = JSON.parse(rawdata);

    

    var EpicArray = [];

    var FeatureArray = [];

    var EpicArray = [];

    let Epicmap = new Map();

    let Featuremap = new Map();

    for(var idx in data) {

        var item = data[idx];

        for(var key in item) {

          var value = item[key];

          //console.log(value.Epic); 

          if(Epicmap.get(value.Epic) == null) {

            console.log("INSERT Epic" + value.Epic); 

            var id = await addWorkItem(witApi, projectName, "Epic", "add", value.Epic);

            Epicmap.set(value.Epic, id)

          }

          if(Featuremap.get(value.Feature) == null) {

            console.log("INSERT Feature" + value.Feature); 

            var id = await addWorkItem(witApi, projectName, "Feature", "add", value.Feature);

            Featuremap.set(value.Feature, id)

          }

          var id = await addWorkItem(witApi, projectName, "User Story", "add", value.Story);

          console.log("INSERT Story" + value.Story + " ID = " + id); 

 

          await updateWorkItem(witApi, projectName, orgUrl, Epicmap.get(value.Epic), Featuremap.get(value.Feature));

          await updateWorkItem(witApi, projectName, orgUrl, Featuremap.get(value.Feature), id);

 

        //   console.log(Epicmap);

        //   console.log(Featuremap);

        //   EpicArray.push(value.Epic);

        //   FeatureArray.push(value.Feature);

 

        }

      }

      

    //   const uniqueEpics = Array.from(new Set(EpicArray));

    //   const uniqueFeatures = Array.from(new Set(FeatureArray));

    //   console.log(uniqueEpics); 

    //   console.log(uniqueFeatures); 

      

 

     var header = {};

     var wijson = [{ "op": "add", "path": "/fields/System.Title", "value": "Feature created from Node JS" }];

     var witype = "Feature";

    // var newworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);

    // console.log(newworkItemID.id);




    var updatelinkjson = [{

        "op": "add",

        "path": "/relations/-",

        "value": {

          "rel": "System.LinkTypes.Dependency-forward",

          "url": orgUrl + "/_apis/wit/workItems/114",

          "attributes": {

            "comment": "Making a new link for the dependency from nodejs"

          }

        }

      }];

}

 

async function addWorkItem(witApi, projectName, workitemtype, operation, value) {

    var header = {};

    var wijson = [{ "op": operation, "path": "/fields/System.Title", "value": value }];

    var witype = workitemtype;

    var newworkItemID = await witApi.createWorkItem(header, wijson, projectName, witype);

    console.log(newworkItemID.id);

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
run();