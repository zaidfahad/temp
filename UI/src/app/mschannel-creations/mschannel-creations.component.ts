import { Component, ElementRef, OnInit, ViewChild  , Renderer2, ViewContainerRef } from '@angular/core';
import { copyFileSync, read } from 'fs';
import { ToastrService } from 'ngx-toastr';
import { from, Observable, of } from 'rxjs';
import { MsgraphService } from 'src/services/msgraphservices/msgraph.service';
import {ServicesService} from '../../services/services.service'


@Component({
  selector: 'app-mschannel-creations',
  templateUrl: './mschannel-creations.component.html',
  styleUrls: ['./mschannel-creations.component.css']
})
export class MSChannelCreationsComponent implements OnInit {
  teamID:string='';
  teamsDetails:any;
  selectedteamID:string='';
  selectChannelID:string='';
  loaderVisibleHide='hidden';
  //channelsPredefinesArray:any=['Dev','Testing','BA','PMO'];
  componentNameList = new Array();
  toolAndProccessNotificationNameList = new Array();
  possibleChannelsListofComponent=new Array();
  @ViewChild('leftSideDivElementID' , { static: false }) leftSideDivElementrefID : ElementRef;
  
  // 
  nextPage:number=0;
  previousPage:number=0;
  allemployeesdetailsPage:any;
  allemployeesdetails:any;
  localSetting=
  {
  formEnabledOrDisabled:'visible',
  isSelected:true,
  teamListdisabled:false,
  isNewCreatedBoardNameDivVisible:'hidden',
  loaderVisibleHide:'hidden',
  newCreatedBoardName:'------------',
  isdisabledsharedbuttonClass:'disabledbutton',
  isdisabledCreateBoardbuttonClass:'button',
  iscreateButtonDisabled:false,
  isshareboardButtonDisabled:true,
  isdisabledPreviousbuttonClass:'disabledbutton disabledbuttonback',
  ispreviousButtonDisabled:true,
  isdisabledNextbuttonClass:'disabledbutton',
  isnextButtonDisabled:true,
  isinstallAppButtonDisabled:false,
  isdisabledinstallAppButtonClass:'button',
  isaddAppButtonDisabled:false,
  isdisabledaddAppButtonClass:'button'
  };
  //
  constructor(private services:ServicesService,private renderer: Renderer2,private msgraphservice:MsgraphService,private toaster:ToastrService) { }
  token:string='';
  ngOnInit(): void {
    this.GetTeamsDetails();
    this.GetPossibleCombination('');
  }

ngAfterViewInit(){
//Ng Init used for dynamo purpose 
}
  
  //Azure Word Count Integration
  GetTeamsDetails(){
    this.services.GetTeamsDetails().subscribe(teams=>{  //((teams: Teams[]) => {
      let jsonObj: any = JSON.parse(JSON.stringify(teams)); // string to generic object first
   this.teamsDetails=jsonObj.value;
  })
  }

   onteamSelectChange(teamsID){
     debugger;
    this.teamID=teamsID;
    this.services.GetChannelsDetails(teamsID).subscribe(result=>  //(channels //:ChannelsDetails[])=>
    {
      let jsonObj: any = JSON.parse(JSON.stringify(result)); // string to generic object first
    });
  }


 
   
  GenerateChannelsName(chckBoxEvent){
    console.log(chckBoxEvent.path[0].defaultValue);
    let nameOfChanel=chckBoxEvent.path[0].defaultValue;
    if(chckBoxEvent.path[0].checked==true &&  
      this.componentNameList.indexOf(nameOfChanel)
      <0)
   {
       this.componentNameList.push(nameOfChanel);
   }else{
    this.componentNameList.splice(this.componentNameList.indexOf(nameOfChanel), 1);
   }
   this.possibleChannelsListofComponent=this.GetPossibleCombination(this.componentNameList);
   //For Channel List Creation 
   if(this.toolAndProccessNotificationNameList.length>0)
  {
    this.toolAndProccessNotificationNameList.forEach(element => {
   this.possibleChannelsListofComponent.push(element);
    });
  }
    this.DesignForms(this.possibleChannelsListofComponent,'Channels List',this.leftSideDivElementrefID);
    var bodydata={"teamID":this.teamID,
    "channelsList":this.possibleChannelsListofComponent};
   }

   GenerateChannelsNameForToolsAndProcess(chckBoxEvent){
    console.log(chckBoxEvent.path[0].defaultValue);
    let nameOfChanel=chckBoxEvent.path[0].defaultValue;
    if(chckBoxEvent.path[0].checked==true &&  
      this.toolAndProccessNotificationNameList.indexOf(nameOfChanel)
      <0)
   {
    this.toolAndProccessNotificationNameList.push(nameOfChanel);
   }else{
    this.toolAndProccessNotificationNameList.splice(this.toolAndProccessNotificationNameList.indexOf(nameOfChanel), 1);
   }
   this.possibleChannelsListofComponent=this.GetPossibleCombination(this.componentNameList);
   //For Channel List Creation 
      //For Channel List Creation 
  if(this.toolAndProccessNotificationNameList.length>0)
  {
    this.toolAndProccessNotificationNameList.forEach(element => {
   this.possibleChannelsListofComponent.push(element);
    });
  }
    this.DesignForms(this.possibleChannelsListofComponent,'Channels List',this.leftSideDivElementrefID);
    var bodydata={"teamID":this.teamID,
    "channelsList":this.possibleChannelsListofComponent};
   }
   /**
    * 
    * @param devCheckBox 
    * @param baCheckBox 
    * @param pmoCheckBox 
    * @param testingCheckBox 
    * @param jiraCheckBox 
    * @param confluenceCheckBox 
    * @param bitbucketCheckBox 
    * @param azuredeveopsCheckBox 
    * @param cicdCheckBox 
    * @param releaseCheckBox 
    * @param builtCheckBox 
    */


   CreateChannels(
    devCheckBox,baCheckBox, 
    pmoCheckBox, 
    testingCheckBox,
    jiraCheckBox,
    confluenceCheckBox ,
    bitbucketCheckBox,
    azuredeveopsCheckBox,
    cicdCheckBox,
    releaseCheckBox,
    builtCheckBox)
    {
   // this.dynamicChanenelsInnerHtml=`<div> <button   type="button"  (click)="Zaid()">Zaid</button> </div>`; 
   //this.leftSideDivElementrefID.innerHtml=null;
    let componentNameList = new Array();
   if(devCheckBox==true){
    componentNameList.push('Dev');
   }if(baCheckBox==true){
    componentNameList.push('BA');
   }if(pmoCheckBox==true){
    componentNameList.push('PMO');
   }if(testingCheckBox==true){
    componentNameList.push('Testing');
   }
   var possibleChannelsListofComponent=this.GetPossibleCombination(componentNameList);

   //List Of Tools
   //let listofToolsComponent= new Array();
   if(jiraCheckBox==true){
    possibleChannelsListofComponent.push('Notification-Jira');
   }
   if(confluenceCheckBox==true){
    possibleChannelsListofComponent.push('Notification-Confluence');
   }
   if(bitbucketCheckBox==true){
    possibleChannelsListofComponent.push('Notification-BitBucket');
   }
   if(azuredeveopsCheckBox==true){
    possibleChannelsListofComponent.push('Notification-AzureDeveops');

    
   }

   //ListTools


   //List of Process
   //let listofProcessComponent= new Array();
   if(cicdCheckBox==true){
    possibleChannelsListofComponent.push('Notification-CICD');
   }
   if(releaseCheckBox==true){
    possibleChannelsListofComponent.push('Notification-Release');
   }
   if(builtCheckBox==true){
    possibleChannelsListofComponent.push('Notification-Built');
   }
   //For Channel List Creation 
    this.DesignForms(possibleChannelsListofComponent,'Channels List',this.leftSideDivElementrefID);
    var bodydata={"teamID":this.teamID,
    "channelsList":possibleChannelsListofComponent};
    //Creating Channels IN Bulks
    this.CreateChannelsInMsteam(bodydata);
 }




      
     /*
    Zaid(){
      alert('MashaAllah')
    }*/

    DynamicCheckBoxesClicked(event){
      console.log(event)
    }

    //Hekper Functions

    GetPossibleCombination(letters)
    {
   // let letters = ['Dev','Testing','BA','PMO'];
    var combi = [];
    var temp= "";
    var letLen = Math.pow(2, letters.length);
    
    for (var i = 0; i < letLen ; i++){
        temp= "";
        for (var j=0;j<letters.length;j++) {
            if ((i & Math.pow(2,j))){ 
              //console.log(letters[j])
              if(temp==''){
                temp = temp+letters[j]
              }else{
                temp = temp+'-'+letters[j]
              }
            }
        }
        if (temp !== "") {
            combi.push(temp);
        }
    }
    
    console.log(combi.join("\n"));   
    return combi;
   }

   


   //Emails

   onMainCheckBoxChanged(checked)
   {
    this.allemployeesdetails.forEach(item => {
        item.isSelected=checked;
    });
  }

    childcheckBoxChangeEvent(id,checked){
      if(checked==false){
        this.localSetting.isSelected=false;
      }
      this.allemployeesdetails.forEach(item => {
        if(item.mail==id)
        {
          item.isSelected=checked;
        }
      });
     
     }

     OnteamSelectChange(teamsID)
    {
      this.teamID=teamsID;
    this.localSetting.isSelected=false;
    this.allemployeesdetails=[];
    this.allemployeesdetailsPage=null;
    this.nextPage=0;
    this.msgraphservice.GetTeamMembersDetails(teamsID).subscribe(result=> 
    {
      let data:any;
       data=result;
      if(data.value!=undefined)
      {
        for(let i=0;i<data.value.length;i++){
          this.allemployeesdetails[i]={displayName:data.value[i].displayName,
          mail:data.value[i].mail,isSelected:false};
        }
        this.Loading(this.allemployeesdetails);

     //Setting applied
    this.localSetting.formEnabledOrDisabled='visible';
    this.localSetting.loaderVisibleHide='hidden';
    this.localSetting.teamListdisabled=false;
    this.localSetting.isNewCreatedBoardNameDivVisible='visible',
    this.localSetting.isdisabledsharedbuttonClass='button';
    this.localSetting.isdisabledCreateBoardbuttonClass='disabledbutton';
    this.localSetting.iscreateButtonDisabled=true;
    this.localSetting.isshareboardButtonDisabled=false;
    this.localSetting.isdisabledPreviousbuttonClass='back';
    this.localSetting.isdisabledNextbuttonClass='button';
    this.localSetting.isnextButtonDisabled=false;
    this.localSetting.ispreviousButtonDisabled=false;
      }else
      {
       this.toaster.error('Data is not fetched from server','Error')
      }
      
    });}

    Loading(result){
      this.localSetting.isSelected=false;
      console.log(result)
      this.allemployeesdetailsPage=[];
      let increment=10;
      let index=this.nextPage;
      for(let i=index;i<increment;i++){
        console.log(this.allemployeesdetails[i])
        this.allemployeesdetailsPage[i]=this.allemployeesdetails[i];
      }
      this.nextPage=this.nextPage+10;
      this.toaster.success('Data is loaded successfully','Message')
     
    }
    NextPage()
   {
   let allemployeesdetailslocal:any[]=[];
   let index=this.nextPage;
   for(let i=0;i<10;i++)
   {
     console.log(this.allemployeesdetails[i])
     allemployeesdetailslocal[i]=this.allemployeesdetails[index];
     index++;
   }
   this.nextPage=this.nextPage+10;
   this.previousPage=this.nextPage-10;
   this.allemployeesdetailsPage=null;
   this.allemployeesdetailsPage=allemployeesdetailslocal;
   console.log(this.allemployeesdetailsPage)
  }

  PreviousPage()
  {
    if(this.previousPage!=0)
    {
   let allemployeesdetailslocal:any[]=[];
   let index=this.previousPage;
   for(let i=0;i<10;i++)
   {
     console.log(this.allemployeesdetails[i])
     allemployeesdetailslocal[i]=this.allemployeesdetails[index-10];
     index++;
   }
   this.nextPage=this.previousPage;
   this.previousPage=this.previousPage-10;
   this.allemployeesdetailsPage=null;
   this.allemployeesdetailsPage=allemployeesdetailslocal;
   console.log(this.allemployeesdetailsPage)
   }
  }
/**
 * 
 * @param bodyData 
 */
  CreateChannelsInMsteam(bodyData){

    this.msgraphservice.CreateChannels(bodyData).subscribe(result=>{
       this.toaster.success('Channels are created in Ms Team','Created Channels')
    })
  }



  NewChannelsAddInList(textboxValue){
    console.log(textboxValue)
  }


  









  //Dyamic Block 

  DesignForms(listOfComponent:string[],headingLabel:string,elements:ElementRef) {
    debugger;
    Array.from(elements.nativeElement.children).forEach(child => {
      //console.log('children.length=' + this.elements.nativeElement.children.length);
      this.renderer.removeChild(elements.nativeElement, child);
    }); 
    if(listOfComponent.length>0){
    //<span class = "label label-danger">Danger Label</span>
   
     const heading = this.renderer.createElement('span');
     this.renderer.setProperty(heading, 'innerText', headingLabel);
     this.renderer.setProperty(heading, 'style', 'height:30px;width:100%;padding:5px');
      this.renderer.setAttribute(heading,'class','badge badge-info');
      this.renderer.appendChild(elements.nativeElement, heading);
    for(var i=0;i<listOfComponent.length;i++){
      const label = this.renderer.createElement('label');
      this.renderer.setProperty(label, 'innerText', listOfComponent[i]);
      this.renderer.setProperty(label,'style','padding: 5px;margin: 5px;');
   const checkbox = this.renderer.createElement('input');
   this.renderer.setProperty(checkbox, 'id', listOfComponent[i]);
   this.renderer.setProperty(checkbox,'style','padding: 15px;margin: 5px;');
   this.renderer.setProperty(checkbox, 'type', 'checkbox');
   this.renderer.setProperty(checkbox, 'innerText', listOfComponent[i]);
   this.renderer.listen(checkbox, 'click',
    (event) => {
     this.DynamicCheckBoxesClicked(event);
   })
   
   this.renderer.appendChild(elements.nativeElement, label);

    this.renderer.appendChild(elements.nativeElement, checkbox
    );
    
  }
}else{
  elements.nativeElement.innerHtml='Select channels checkboxes'
}
 }


  //Dynamic Block End
}

/*const button = this.renderer.createElement('button');
       this.renderer.setProperty(button, 'id', 'popup');
       this.renderer.setProperty(button, 'innerText', 'Copy');
       this.renderer.listen(button, 'click',
        (event) => {
         this.Zaid();
       })
   
       this.renderer.appendChild(this.leftSideDivElementrefID.nativeElement, button);
    */
