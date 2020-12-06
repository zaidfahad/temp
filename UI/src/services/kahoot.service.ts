import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
  import { HttpHeaders } from '@angular/common/http';
  //import {Headers} from 'angular2/http';
  import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class KahootService {

  constructor(private http: HttpClient) { }



  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', 'http://localhost:4200')
  .set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
  .set('Authorization', '');

   url = "http://localhost:5000/api";
    
 GetToken(){
   var body={"username":"prideofindia","password":"Test@123"};
  return this.http.post(this.url+'/kahoot/Authenticate',body,{headers:this.headers});

 }

 GetDraftConfiguration(token){
   //kahoot/draftspace  need to check issue header also
 let bodyData={"token":'Bearer '+token};
   return this.http.post(this.url+'/kahoot/draftspace',bodyData,{headers:this.headers});
 }
 
 
 SubmitGameStructureOnKahoot(gameStructure,token,folderID){
  let bodyData
    =
      {
   "token":'Bearer '+token,
   "gamestructure":gameStructure,
   "folderID":folderID
       };
  return this.http.put(this.url+'/kahoot/SubmitGameInstance',bodyData,{headers:this.headers});
 }

 PublishGameOnKahoot(token,folderID){
  let bodyData
    =
      {
   "token":'Bearer '+token,
   "folderID":folderID
       };
  return this.http.post(this.url+'/kahoot/PublishGame',bodyData,{headers:this.headers});
 }
}