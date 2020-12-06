import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
interface Sprint {
  SNo?: Number;
  Epic?: String;
  Feature?: String;
  UserStory: String;
  Description: String;
 }

@Component({
  selector: 'app-azure-deveop',
  templateUrl: './azure-deveop.component.html',
  styleUrls: ['./azure-deveop.component.css'],
  providers:[ServicesService]
})
export class AzureDeveopComponent implements OnInit 
{
  azureDeveopData : any;
  data: any[];
  azureprojectDetails:any;
  selectedDataInGrid: any[] = [];
  organizationsDetails: any[] = [];
  projectsDetails: any[] = [];
  azureDeveopDataPaging:any[]=[];
  nextPage:number=0;
  previousPage:number=0;
  projecturls:string='';
  organizationname:string='';
  projectname:string='';
  constructor(private services:ServicesService,private toaster:ToastrService)
   {
   }

  ngOnInit(): void
   {
    this.getdata();
    this.getProjectDetails();
  }

   
   getdata()
   {
     this.services.GetData().subscribe((result)=>{
      this.azureDeveopData=result;
      console.log(result)
      this.azureDeveopDataPaging=[];
      let increment=10;
      let index=this.nextPage;
      for(let i=index;i<increment;i++){
        console.log(this.azureDeveopData[i])
        this.azureDeveopDataPaging[i]=this.azureDeveopData[i];
      }
      this.nextPage=this.nextPage+10;
      console.log(this.azureDeveopDataPaging)
    })
   }

   //Urls Organization and Projects Details
   getProjectDetails()
   {
     this.services.GetAzureBaseUrl().subscribe((result)=>{
       console.log(result)
       this.azureprojectDetails=result;
     })
   }

    //If Main Checked then Load All data to send 
    onMainCheckBoxChanged(checked)
   {
    this.selectedDataInGrid= [];
    if(checked==true)
    {
      this.selectedDataInGrid.push(this.azureDeveopData)
    }
    else
    {
      this.selectedDataInGrid= [];
    }
    console.log(this.selectedDataInGrid)
   }

      
   
   //Checked Box Select Data 
    childcheckBoxChangeEvent(id,checked){
    this.azureDeveopData.forEach(item => {
      if(item._id===id && checked==true)
      {
        this.selectedDataInGrid.push(item)
      }
      else if(item._id===id && checked==false){
         const index: number = this.selectedDataInGrid.indexOf(item);
         this.selectedDataInGrid.splice(index,1);
        }
     })
     console.log(this.selectedDataInGrid)
   }


   onParentSelectChange(selectedValue){
     this.projecturls=selectedValue;
    this.organizationsDetails=[];
     this.azureprojectDetails.forEach(element => {
       if(element.name==selectedValue){
         element.organization.forEach(org => 
          {
          this.organizationsDetails.push(org.name);
         });
       }
     });
     console.log(this.organizationsDetails)
   }

   onOrganizationSelectChange(selectedValue){
    this.organizationname=selectedValue;
        this.projectsDetails=[];
        this.azureprojectDetails.forEach(element => {
         element.organization.forEach(org => 
         {
        if(org.name==selectedValue)
        {
          org.project.forEach(prObj => {
          this.projectsDetails.push(prObj);
          });
         }
       })
      }) 
      console.log(this.projectsDetails)
     }

     onProjectDetailsSelectChange(selectedvalue){
      this.projectname=selectedvalue;
     }


     UploadData(){
       var count=this.selectedDataInGrid.length;
       let data ={
        "BaseUrl": this.projecturls,
       "Organization": this.organizationname,
       "Project": this.projectname,
       "WorkItemList": this.selectedDataInGrid
       };
        this.services.UploadData(data).subscribe((result)=>
        {
       console.log(result)
            this.toaster.success('Acitivity', 'Activity is created');
          
        });
     }



     //Paging 

     NextPage()
     {
      let azureDeveopDatalocal:any[]=[];
      
      let index=this.nextPage;
      for(let i=0;i<10;i++){
        console.log(this.azureDeveopData[i])
        azureDeveopDatalocal[i]=this.azureDeveopData[index];
        index++;
      }
      this.nextPage=this.nextPage+10;
      this.previousPage=this.nextPage-10;
      this.azureDeveopDataPaging=null;
      this.azureDeveopDataPaging=azureDeveopDatalocal;
      console.log(this.azureDeveopDataPaging)
     }

     PreviousPage()
     {
       if(this.previousPage!=0)
       {
       let azureDeveopDatalocal:any[]=[];
       let index=this.previousPage;
       for(let i=0;i<10;i++){
        console.log(this.azureDeveopData[i])
        azureDeveopDatalocal[i]=this.azureDeveopData[index-10];
        index++;
      }
      this.nextPage=this.previousPage;
      this.previousPage=this.previousPage-10;
      this.azureDeveopDataPaging=null;
      this.azureDeveopDataPaging=azureDeveopDatalocal;
      console.log(this.azureDeveopDataPaging)
      }
     }
  }