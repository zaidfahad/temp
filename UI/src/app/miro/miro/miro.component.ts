import { Component, OnInit } from '@angular/core';
import {MiroservicesService}from '../../../services/miroservices/miroservices.service';
import { ToastrService } from 'ngx-toastr';

import {ServicesService} from '../../../services/services.service'

import {MsgraphService} from '../../../services/msgraphservices/msgraph.service'
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ChannelsDetails } from 'src/app/Models/ChannelsDetails';
@Component({
  selector: 'app-miro',
  templateUrl: './miro.component.html',
  styleUrls: ['./miro.component.css']
})
export class MiroComponent implements OnInit
 {
  

  createdboardurl='';
  loaddata:any=[];
  teamsDetails:any;
  channelsDetails:any;
  allemployeesdetails:any;
  allemployeesdetailsPage:any;
  nextPage:number=0;
  previousPage:number=0;
  BoardID:string='';
  //TODO: API is ready we need just call to get miro id by api
  miroAppID:string='';
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
  constructor(private miroServices:MiroservicesService,private toaster:ToastrService,private services:ServicesService,private msgraphservice:MsgraphService) { }

  ngOnInit(): void {
    this.OnLoadApplyingSetting();
    this.SearchAppIDByName('Miro');
  }
   SearchAppIDByName(appName){
    this.msgraphservice.SearchAppInCatalogByName(appName).subscribe(miroresult=>{  
      let jsonObj: any = JSON.parse(JSON.stringify(miroresult)); 
     this.miroAppID=jsonObj.id;
     console.log(this.miroAppID)
    })
   }
  OnLoadApplyingSetting(){
    this.localSetting.formEnabledOrDisabled='visible';
    this.localSetting.loaderVisibleHide='hidden';
    this.localSetting.teamListdisabled=false;
    this.localSetting.isNewCreatedBoardNameDivVisible='hidden',
    this.localSetting.isdisabledsharedbuttonClass='disabledbutton';
    this.localSetting.isdisabledCreateBoardbuttonClass='disabledbutton';
    this.localSetting.iscreateButtonDisabled=true;
    this.localSetting.isshareboardButtonDisabled=true;
    this.localSetting.isdisabledPreviousbuttonClass='disabledbutton disabledbuttonback';
    this.localSetting.isdisabledNextbuttonClass='disabledbutton';
    this.localSetting.isnextButtonDisabled=true;
    this.GetTeamsDetails();
  }
  GetTeamsDetails()
  {
    this.localSetting.isSelected=false;
    this.services.GetTeamsDetails().subscribe(teams=>{  
    let jsonObj: any = JSON.parse(JSON.stringify(teams)); 
   this.teamsDetails=jsonObj.value;
  })
  }

  CheckIfAllFieldsFilled(boardname,description,sharingpolicyaccess,teampolicy){
    this.localSetting.formEnabledOrDisabled='visible';
    this.localSetting.loaderVisibleHide='hidden';
    this.localSetting.teamListdisabled=false;
    this.localSetting.isNewCreatedBoardNameDivVisible='hidden',
    this.localSetting.isdisabledsharedbuttonClass='disabledbutton';
    this.localSetting.isshareboardButtonDisabled=true;
    this.localSetting.isdisabledPreviousbuttonClass='disabledbutton disabledbuttonback';
    this.localSetting.isdisabledNextbuttonClass='disabledbutton';
    this.localSetting.isnextButtonDisabled=true;
    if(boardname!=null && boardname!='' && description!=null &&description!='' &&
    sharingpolicyaccess!=null && teampolicy!=null){
  
      this.localSetting.isdisabledCreateBoardbuttonClass='button';
      this.localSetting.iscreateButtonDisabled=false;
    }else{
      this.localSetting.isdisabledCreateBoardbuttonClass='disabledbutton';
      this.localSetting.iscreateButtonDisabled=true;
    }

  }
  CreateBoard(boardname,description,sharingpolicyaccess,teampolicy){
    console.log('test');
    let localdata:any;
    this.localSetting.formEnabledOrDisabled='hidden';
    this.localSetting.loaderVisibleHide='visible';
    var data={
     "boardname":boardname,
     "description":description,
     "sharingpolicy":sharingpolicyaccess,
     "teampolicy":teampolicy
    };
    this.miroServices.CreateBoards(data).subscribe((result)=>
    {
     let data:any;
     data=result;
     this.BoardID=data.id;
    this.localSetting.newCreatedBoardName=boardname;
     this.localSetting.formEnabledOrDisabled='visible';
    this.localSetting.loaderVisibleHide='hidden';
    this.localSetting.teamListdisabled=false;
    this.localSetting.isNewCreatedBoardNameDivVisible='visible',
    this.localSetting.isdisabledsharedbuttonClass='button';
    this.localSetting.isdisabledCreateBoardbuttonClass='disabledbutton';
    this.localSetting.iscreateButtonDisabled=true;
    this.localSetting.isshareboardButtonDisabled=false;
    this.localSetting.isdisabledPreviousbuttonClass='disabledbutton disabledbuttonback';
    this.localSetting.isdisabledNextbuttonClass='disabledbutton';
    this.localSetting.isnextButtonDisabled=true;

      this.toaster.success('Miro board is created with name '+boardname);
    console.log(result)
    localdata=JSON.stringify(result);
     this.loaddata={name:boardname,description:description};
     console.log(this.loaddata)
    })
  }

  OnteamSelectChange(teamsID)
  {
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
      
    });

    //Loading Channels 

    console.log(teamsID)
    let category: ChannelsDetails[];
    this.services.GetChannelsDetails(teamsID).subscribe(result=> 
    {
      let jsonObj: any = JSON.parse(JSON.stringify(result));
      this.channelsDetails=jsonObj.value;
    });
  }

  /**Paging  */
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

  /** Paging */
  
  /* Employee Details */

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
   onMainCheckBoxChanged(checked)
   {
    this.allemployeesdetails.forEach(item => {
        item.isSelected=checked;
    });
     
   }


   SharedBoardWithTeamMates()
   {
    let bodyData:any;
    let emails:any=[];
    this.localSetting.formEnabledOrDisabled='hidden';
    this.localSetting.loaderVisibleHide='visible';
    //TODO: Board can be shared only those users who is tagged with Miro in team like if there 
    /// SSO with same mail id then only
    /*this.allemployeesdetails.forEach(item => {
      if(item.isSelected==true){
        emails.push(item.mail);
      }
  });*/
  let incre=0;
  for (let index = 0; index < this.allemployeesdetails.length; index++) {
    if(this.allemployeesdetails[index].isSelected==true)
    {
      emails[incre]=this.allemployeesdetails[index].mails;
      incre++;
    }
    
  }
  bodyData={
    "emails":emails,
    "teamInvitationStrategy":"off",
    "message":"Hey I am sharing "+this.localSetting.newCreatedBoardName+" the board with you ","role":"editor"
  };
     this.miroServices.SharedBaordWithTeamMates(this.BoardID,bodyData).subscribe(result=> 
      {
       this.toaster.success('Board is shared','Board Information');
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
      });
   }

    //On Channel Selection Change  
    OnchannelselectChange(channelsID){
    console.log(channelsID)
    }
    
     InstallAppToMsTeam(teamID)
     {
      let result:any;
       this.localSetting.formEnabledOrDisabled='hidden';
       this.localSetting.loaderVisibleHide='visible';
      this.msgraphservice.InstallApp(this.miroAppID,teamID).
      subscribe(data=> 
      {
       result=data;
      console.log(data);
      if(result.statusCode!=undefined && result.statusCode!=200){
        result=JSON.parse(result.body).message;
        this.toaster.error(result,'Error ')
      }else{
        this.toaster.success('Miro is installed in Microsoft Team successfully','Success')
      }
      this.localSetting.formEnabledOrDisabled='visible';
      this.localSetting.loaderVisibleHide='hidden';
      })
    }

    /** Add Tab of Miro in Ms Team Channels */

    AddAppIntoTabInMSTeamsChannel(teamID,channelID){
       let result:any;
      this.localSetting.formEnabledOrDisabled='hidden';
      this.localSetting.loaderVisibleHide='visible';
      this.msgraphservice.AddMiroInMsTeamTab(this.miroAppID,teamID,channelID).
      subscribe(data=> 
      {
        result=data;
      console.log(data);
      if(result.statusCode!=undefined && result.statusCode!=200){
        result=JSON.parse(result.body).message;
        this.toaster.error(result,'Error ')
      }else{
        this.toaster.success('Miro is installed in Microsoft Team Channel Tab Successfully','Success')
      }
        console.log(data);
        this.localSetting.formEnabledOrDisabled='visible';
        this.localSetting.loaderVisibleHide='hidden';
      })

    }
}  
