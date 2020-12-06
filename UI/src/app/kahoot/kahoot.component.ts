import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {UserDetails} from '../Models/Kahoot/UserDetails'
import {KahootService} from '../../services/kahoot.service'
import { WSASERVICE_NOT_FOUND } from 'constants';
import { Observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { EmailValidator } from '@angular/forms';
import { resourceUsage } from 'process';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-kahoot',
  templateUrl: './kahoot.component.html',
  styleUrls: ['./kahoot.component.css']
})
export class KahootComponent implements OnInit {
  kahootGameQuestionList:any;
  userDetails:any;
  loaderVisibleHide:string='hidden';
  questionsCollections:any;
  checkboxorradio:string='radio'
  ifQuestionTypeTruefalse:string='visible';
  getdraftConfiguration:any;
  

  //Form Inputs
  @ViewChild('questions') questionsInput: ElementRef;
  @ViewChild('answerchoicetextbox1') answerchoicetextbox1Input: ElementRef;
  @ViewChild('answerchoicecheckbox1') answerchoicecheckbox1Input: ElementRef;

  @ViewChild('answerchoicetextbox2') answerchoicetextbox2Input: ElementRef;
  @ViewChild('answerchoicecheckbox2') answerchoicecheckbox2Input: ElementRef;

  @ViewChild('answerchoicetextbox3') answerchoicetextbox3Input: ElementRef;
  @ViewChild('answerchoicecheckbox3') answerchoicecheckbox3Input: ElementRef;

  @ViewChild('answerchoicetextbox4') answerchoicetextbox4Input: ElementRef;
  @ViewChild('answerchoicecheckbox4') answerchoicecheckbox4Input: ElementRef;
 
  // Form  Inputs
  constructor(private kathootServices:KahootService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loaderVisibleHide='hidden';
    this.questionsCollections=[];
    this.GetUserDetails();

  }

GetUserDetails(){
  this.kathootServices.GetToken().subscribe(result=>{
    let data:any;
    data=result;
    this.GetConfiguration(data.access_token);
   this.userDetails={
     token:data.access_token,
     userid:data.user.uuid,
     email:data.user.email,
     username:data.user.username    
   };
  
   console.log(this.userDetails);
  });
  
}



GetConfiguration(token){
  this.kathootServices.GetDraftConfiguration(token).subscribe(result=>{
    this.getdraftConfiguration=result;
  })
}

OnQuestionsTypeSelectionChange(selectedValue)
{
  this.answerchoicetextbox1Input.nativeElement.disabled=false;
  this.answerchoicetextbox2Input.nativeElement.disabled=false;
if(selectedValue=="multichoice" || selectedValue=="Select" ){
  this.checkboxorradio='checkbox'
  this.ifQuestionTypeTruefalse='visible';
} 
else  if(selectedValue=="singlechoice")
{
  this.checkboxorradio='radio'
  this.ifQuestionTypeTruefalse='visible';
}
else  if(selectedValue=="truefalse")
{
  this.ResetForms();
  this.checkboxorradio='radio'
  this.ifQuestionTypeTruefalse='hidden';
  this.answerchoicetextbox1Input.nativeElement.value='True';
  this.answerchoicetextbox2Input.nativeElement.value='False';
  this.answerchoicetextbox1Input.nativeElement.disabled=true;
  this.answerchoicetextbox2Input.nativeElement.disabled=true;
}

}

AddQuestions
 (
   question: any,
   answerchoicetext1: string,
  answerchoice1: boolean,
  answerchoicetext2: string,
  answerchoice2: boolean,
  answerchoicetext3: string,
  answerchoice3: boolean,
  answerchoicetext4: string,
  answerchoice4: boolean, 
  )
  {

    /*
          "type":"quiz",
            "layout":"TRUE_FALSE",

      =============

       "type":"multiple_select_quiz",
            "layout":"CLASSIC",
======================================
             "type":"quiz",  //simgle
            "layout":"CLASSIC",
    */
   let _querstions= 
   {
      "question":question,
      "type":"multiple_select_quiz",
      "layout":"CLASSIC",
      "choices":[
         {
            "answer":answerchoicetext1,
            "correct":answerchoice1
         },
         {
          "answer":answerchoicetext2,
          "correct":answerchoice2
         },
         {
          "answer":answerchoicetext3,
          "correct":answerchoice3
         },
         {
          "answer":answerchoicetext4,
          "correct":answerchoice4
         }
        ],
            "numberOfAnswers":4,
            "questionFormat":0,
            "resources":"",
            "time":20000,
            "video":{
               "fullUrl":"",
               "startTime":0,

               "endTime":0
            },
            "pointsMultiplier":1
      };
  this.questionsCollections.push(_querstions);
  this.getdraftConfiguration.kahoot.questions=this.questionsCollections;
  let today = Date.now();
  this.getdraftConfiguration.kahoot.title="Zaid"+" "+today;
  this.getdraftConfiguration.kahoot.slug="Zaid"+" "+today;
  console.log(_querstions);
  console.log(JSON.stringify(this.getdraftConfiguration))
  this.ResetForms();
  this.toastr.success('Questions is added ','Questions');
  
  }

  PublishGame(){
    this.loaderVisibleHide='visible';

    var  structure=JSON.stringify(this.getdraftConfiguration);
    var folderID=this.getdraftConfiguration.id;
    this.kathootServices.SubmitGameStructureOnKahoot(structure, this.userDetails.token,folderID).
    subscribe(data=>{
    
      this.toastr.success('Game Structure','Game Structrues is saved');
      this.kathootServices.PublishGameOnKahoot(this.userDetails.token,folderID).subscribe(publishData=>
      {
        this.loaderVisibleHide='hidden';
        this.toastr.success('Game Publish','Game Published on Kahoot');
      })
    })
  }


  ResetForms(){
    this.questionsInput.nativeElement.value = '';
    this.answerchoicetextbox1Input.nativeElement.value='';
    this.answerchoicecheckbox1Input.nativeElement.checked=false;

    this.answerchoicetextbox2Input.nativeElement.value='';
    this.answerchoicecheckbox2Input.nativeElement.checked=false;

    this.answerchoicetextbox3Input.nativeElement.value='';
    this.answerchoicecheckbox3Input.nativeElement.checked=false;

    this.answerchoicetextbox4Input.nativeElement.value='';
    this.answerchoicecheckbox4Input.nativeElement.checked=false;
  }
}


