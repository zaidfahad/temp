import { Component, OnInit,ViewChild } from '@angular/core';
import { element } from 'protractor';
import { ServicesService } from '../../services/services.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

interface Dummy {
  value: number | 'auto';
  str: string;
}
@Component({
  selector: 'app-sprints-details',
  templateUrl: './sprints-details.component.html',
  styleUrls: ['./sprints-details.component.css'],
  providers:[ServicesService]
})
export class SprintsDetailsComponent implements OnInit {

  sprintsDetailsData : any;
  data: any[];
  selectedDataInGrid: any[] = [];
  azureDeveopDataPaging:any[]=[];
  nextPage:number=0;
  previousPage:number=0;
  bkColor = "var(--green-color)";
  formEnabledOrDisabled='visible';
  loaderVisibleHide='hidden';
  lntloader='hidden';
  constructor(private services:ServicesService,private toasterMessage:ToastrService) {
   }

  ngOnInit(): void {
    // this.getdata();
    // this.getProjectDetails();
  }

   
   


  @ViewChild('velocity') velocityName;
  @ViewChild('throughPut') throughPutName;
  @ViewChild('leadTime') leadTimeName;
  @ViewChild('blockingTime') blockingTimeName;
  @ViewChild('cycleTime') cycleTimeName;
  @ViewChild('workItemAge') workItemAgeName;
  @ViewChild('flowEfficiency') flowEfficiencyName;
  @ViewChild('backlogReadiness') backlogReadinessName;
  @ViewChild('percentComplete') percentCompleteName;

  handleClear(){
    // clearing the value
  this.velocityName.nativeElement.value = ' ';
  this.throughPutName.nativeElement.value = ' ';
  this.leadTimeName.nativeElement.value = ' ';
  this.blockingTimeName.nativeElement.value = ' ';
  this.cycleTimeName.nativeElement.value = ' ';
  this.workItemAgeName.nativeElement.value = ' ';
  this.flowEfficiencyName.nativeElement.value = ' ';
  this.backlogReadinessName.nativeElement.value = ' ';
  this.percentCompleteName.nativeElement.value = ' ';
}
     //
     CalculateActualVelocity(velocity,leadTime,cycleTime,throughPut,blockingTime,workItemAge,flowEfficiency,backlogReadiness,percentComplete)
     {
       try{
        if(velocity!='' && leadTime!='' && cycleTime!='' && throughPut != '' && blockingTime !='' && workItemAge != '' && flowEfficiency != '' && backlogReadiness != '' && percentComplete != ''){
       this.loaderVisibleHide='visible';
       this.formEnabledOrDisabled='none';
       let dataBody={
        "Velocity":velocity,
        "LeadTime":leadTime,
        "CycleTime":cycleTime,
        "ThroughPut":throughPut,
        "BlockedTime":blockingTime,
        "WorkItemAge":workItemAge,
        "FlowEfficiency":flowEfficiency,
        "BacklogReadiness":backlogReadiness,
        "PercentComplete":percentComplete,
        "Data":"Submit"
      };
      this.services.SubmitSprintsDetails(dataBody).subscribe((result)=>{
       console.log(result);
       if (result == 'Success')
       {
        // this.loaderVisibleHide='hidden';
        this.handleClear();
       }
       this.loaderVisibleHide='hidden';
       this.lntloader='hidden';
       this.formEnabledOrDisabled='visible';
      //  this.sprintsDetailsData=result;
      this.toasterMessage.success('Process is completed successfully.')
      });
    }else{
     this.toasterMessage.info('Please Enter Values !')
    }
    }catch(e){
      this.toasterMessage.error(e);
    }
  }
  RefreshData()
  {
    try{
      let dataBody={
          "Data":"Refresh"
      };
      this.loaderVisibleHide='visible';
    this.services.GetSprintsDetails(dataBody).subscribe((result)=>{
    console.log(result);
    this.loaderVisibleHide='hidden';
    this.formEnabledOrDisabled='visible';
    this.sprintsDetailsData=result;
    this.toasterMessage.success('Refresh Data successfully.')
   });
 }
 catch(e){
   this.toasterMessage.error(e);
 }
}
}
