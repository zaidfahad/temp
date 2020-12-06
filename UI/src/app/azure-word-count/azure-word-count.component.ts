import { Component, OnInit } from '@angular/core';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { from, Observable, of } from 'rxjs';
import {ServicesService} from '../../services/services.service'
import { ChannelsDetails } from '../Models/ChannelsDetails';
import { Organizations } from '../Models/Organizations';
import { Teams, Values } from '../Models/Teams';
@Component({
  selector: 'app-azure-word-count',
  templateUrl: './azure-word-count.component.html',
  styleUrls: ['./azure-word-count.component.css']
})
export class AzureWordCountComponent implements OnInit {
  teamsDetails:any;
  channelsDetails:any;
  selectedteamID:string='';
  selectChannelID:string='';
  loaderVisibleHide='hidden';
  timeduration:any;
  selectDurationID:string='';
  lastModifiedDate:any;
  
  constructor(private services:ServicesService) { }
  options: CloudOptions = {
    width: 1000,
    height: 400,
    overflow: false,
  };
 
  wordCountdata: CloudData[] = [ ];
  token:string='';
  ngOnInit(): void {
    this.GetTeamsDetails();
  }

  //Azure Word Count Integration
  GetTeamsDetails(){
    this.services.GetTeamsDetails().subscribe(teams=>{  //((teams: Teams[]) => {
      let jsonObj: any = JSON.parse(JSON.stringify(teams)); // string to generic object first
   //let localteams: Teams = <Teams>jsonObj;
   this.teamsDetails=jsonObj.value;
  })
  }

  onteamSelectChange(teamsID){
    console.log(teamsID)
    let category: ChannelsDetails[];
    this.services.GetChannelsDetails(teamsID).subscribe(result=>  //(channels //:ChannelsDetails[])=>
    {
      let jsonObj: any = JSON.parse(JSON.stringify(result)); // string to generic object first
  
      this.channelsDetails=jsonObj.value;
      
    });
  }


 
  
  onchannelselectChange(channelsID){
  this.selectChannelID=channelsID;
  }

  GetChannelDurationMessages(selectChannelID,selectedteamID,lastModifiedDate,wordFrequency){
    this.loaderVisibleHide='visible'; 
    let localCount:CloudData[]=[];
     this.wordCountdata=[] ;
     this.services.GetChannelDurationMessages(selectedteamID,selectChannelID,lastModifiedDate,wordFrequency).subscribe(result=>  //(channels //:ChannelsDetails[])=>
     {
       //let jsonObj: any = JSON.parse(JSON.stringify(result)); // string to generic object first
       //let localteams: ChannelsDetails = <ChannelsDetails>jsonObj;
      //console.log(result)
      let arrays:any;
      arrays=result;
      arrays.forEach(element => {
       localCount.push({text:element.Name,weight:element.Weight,color:"#bb335b"});
     
     });
     this.AzureWordCountNewData(localCount);
      
     });

    
   }
   

 
   

  AzureWordCountNewData(localCount){
    console.log(localCount);
    this.loaderVisibleHide='hidden';
    const changedData$: Observable<CloudData[]> = of(localCount);
    changedData$.subscribe(res => this.wordCountdata = res);
  }


  GetToken(){
    this.services.GetToken().subscribe(data=>{
      console.log(data);
      let jsonObj: any = JSON.parse(JSON.stringify(data));
      this.token=JSON.stringify(jsonObj.text);
       console.log(data);
    })
  }

  
}
