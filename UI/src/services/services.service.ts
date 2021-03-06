import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
  import { HttpHeaders } from '@angular/common/http';
  import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class ServicesService
{

  constructor(private http: HttpClient)
   {
   }
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', 'http://localhost:4200')
  .set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
  .set('Authorization', 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFkbGpzbTR4alUtY2paTVJrSDBsREwtM2hjc3gtdzMyai10WGQ0bklBbXciLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80ZDU4OWE3YS1hMzM1LTRmYWQtOWEyMC0zNGQ5NTA5ZTBmNGIvIiwiaWF0IjoxNjA3MTY0MzkzLCJuYmYiOjE2MDcxNjQzOTMsImV4cCI6MTYwNzE2ODI5MywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVVRQXUvOFJBQUFBZTdEZEljVGdmUDdoWDNGaGoyOU9aY3M4NVMyTlRGczdRcDl0L0MrV1JRSlJacVErWnJKcFdacTlGRytuVUZTWDFVbEhQb3o3Q0hHcTI4YVhRaUN2MGc9PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggZXhwbG9yZXIgKG9mZmljaWFsIHNpdGUpIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IktoYW4iLCJnaXZlbl9uYW1lIjoiWmFpZCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI3LjcuMTgxLjI0NyIsIm5hbWUiOiJaYWlkIEtoYW4iLCJvaWQiOiIwZWQxZjJhMC0xOGU4LTRkYWUtOWZlNi04Zjc2ZGE3NDkwYTkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDBGMjMzRUU2QiIsInJoIjoiMC5BQUFBZXBwWVRUV2pyVS1hSURUWlVKNFBTN1hJaTk3NTJiRklxSzIzU05weVVHUnhBQWcuIiwic2NwIjoiQXBwQ2F0YWxvZy5SZWFkLkFsbCBBcHBDYXRhbG9nLlJlYWRXcml0ZS5BbGwgQXBwQ2F0YWxvZy5TdWJtaXQgQXBwbGljYXRpb24uUmVhZC5BbGwgQXBwbGljYXRpb24uUmVhZFdyaXRlLkFsbCBBcHBSb2xlQXNzaWdubWVudC5SZWFkV3JpdGUuQWxsIEFwcHJvdmFsLlJlYWQuQWxsIEFwcHJvdmFsLlJlYWRXcml0ZS5BbGwgQ2hhbm5lbC5DcmVhdGUgQ2hhbm5lbC5EZWxldGUuQWxsIENoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVtYmVyLlJlYWQuQWxsIENoYW5uZWxNZW1iZXIuUmVhZFdyaXRlLkFsbCBDaGFubmVsTWVzc2FnZS5EZWxldGUgQ2hhbm5lbE1lc3NhZ2UuRWRpdCBDaGFubmVsTWVzc2FnZS5SZWFkLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYW5uZWxTZXR0aW5ncy5SZWFkLkFsbCBDaGFubmVsU2V0dGluZ3MuUmVhZFdyaXRlLkFsbCBEaXJlY3RvcnkuQWNjZXNzQXNVc2VyLkFsbCBEaXJlY3RvcnkuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBHcm91cE1lbWJlci5SZWFkLkFsbCBHcm91cE1lbWJlci5SZWFkV3JpdGUuQWxsIElkZW50aXR5Umlza3lVc2VyLlJlYWQuQWxsIElkZW50aXR5Umlza3lVc2VyLlJlYWRXcml0ZS5BbGwgb3BlbmlkIFBvbGljeS5SZWFkV3JpdGUuQXBwbGljYXRpb25Db25maWd1cmF0aW9uIHByb2ZpbGUgUm9sZU1hbmFnZW1lbnQuUmVhZC5EaXJlY3RvcnkgUm9sZU1hbmFnZW1lbnQuUmVhZFdyaXRlLkRpcmVjdG9yeSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVGVhbU1lbWJlci5SZWFkLkFsbCBUZWFtTWVtYmVyLlJlYWRXcml0ZS5BbGwgVGVhbU1lbWJlci5SZWFkV3JpdGVOb25Pd25lclJvbGUuQWxsIFRlYW1zQWN0aXZpdHkuUmVhZCBUZWFtc0FjdGl2aXR5LlNlbmQgVGVhbXNBcHAuUmVhZCBUZWFtc0FwcC5SZWFkLkFsbCBUZWFtc0FwcC5SZWFkV3JpdGUgVGVhbXNBcHAuUmVhZFdyaXRlLkFsbCBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkRm9yQ2hhdCBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkRm9yVGVhbSBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkRm9yVXNlciBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkV3JpdGVGb3JDaGF0IFRlYW1zQXBwSW5zdGFsbGF0aW9uLlJlYWRXcml0ZUZvclRlYW0gVGVhbXNBcHBJbnN0YWxsYXRpb24uUmVhZFdyaXRlRm9yVXNlciBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkV3JpdGVTZWxmRm9yQ2hhdCBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkV3JpdGVTZWxmRm9yVGVhbSBUZWFtc0FwcEluc3RhbGxhdGlvbi5SZWFkV3JpdGVTZWxmRm9yVXNlciBUZWFtU2V0dGluZ3MuUmVhZC5BbGwgVGVhbVNldHRpbmdzLlJlYWRXcml0ZS5BbGwgVGVhbXNUYWIuQ3JlYXRlIFRlYW1zVGFiLlJlYWQuQWxsIFRlYW1zVGFiLlJlYWRXcml0ZS5BbGwgVXNlci5FeHBvcnQuQWxsIFVzZXIuSW52aXRlLkFsbCBVc2VyLk1hbmFnZUlkZW50aXRpZXMuQWxsIFVzZXIuUmVhZCBVc2VyLlJlYWQuQWxsIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyLlJlYWRXcml0ZSBVc2VyLlJlYWRXcml0ZS5BbGwgZW1haWwiLCJzdWIiOiJwYTBoOGNtYUJ3X1ItV2dIcVZJWF91LUIxX1dYWEhVMU9Sdm1yR293alEwIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNGQ1ODlhN2EtYTMzNS00ZmFkLTlhMjAtMzRkOTUwOWUwZjRiIiwidW5pcXVlX25hbWUiOiJ6YWlkYWhtYWRraGFuQHphaWRhaG1hZGtoYW4ub25taWNyb3NvZnQuY29tIiwidXBuIjoiemFpZGFobWFka2hhbkB6YWlkYWhtYWRraGFuLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IkdoWTM3Vy10OGtPU3lVZ3JHV2VSQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiUXRjcnptQmYyTTV1T3hKVTM3UlZyUkxMcG9raGxtOVEtczRWSXVIQ25aOCJ9LCJ4bXNfdGNkdCI6MTYwMzk2MzEyMX0.tjrE-SMebO-5K0PhUHtBH7dqaNyysqY1CNVo0cPO4urd6kO9oSwcvD72thfjI8EDUTTuFCrjIflmIl-DXI8I6gXDCTGi00dwj5ozoJA5VWQQZKtqqEEg1AVSMhOr8vYokrMnuZ8FRPTAo9239FWdck128jUEY8fl2a5qStA_XY66Ed0w7IS795Xm4yo4GoAWt7TBIFjqHvu0WkF3tVS-3mLJ0eT_v9m7X006WHLtJMmlwscJdApY9gRWj2SyeuJPAcWZOafK7wf-7veY1F-Qi4OP9wc9ejO96wooxuPPhHDENZEgX7eh3yhE9eQR0RmkZHCP5uYcpZt-45iFKlfYtQ');

   url = "http://localhost:5000/api";
    

   GetAzureBaseUrl()
   {
    return this.http.get(this.url+'/BaseUrl',{headers:this.headers});
   }

    GetData() 
    {
      return this.http.get(this.url+'/AllReferenceWorkItem',{headers:this.headers});
    }
    
    UploadData(dataToUpload){
      console.log(dataToUpload);
      return this.http.post(this.url+'/AddReferenceWorkItem',dataToUpload);
    }

    

  GetTeamsDetails() {
    return this.http.get(this.url+'/myteam',{headers:this.headers});
 } 
  GetChannelsDetails(teamID) {
  return this.http.get(this.url+'/mychannel/'+teamID,{headers:this.headers});
} 
SubmitSprintsDetails(dataBody){
  console.log(dataBody)
  return this.http.post(this.url+'/AgileMetric',dataBody,{headers:this.headers});
}

GetSprintsDetails(dataBody){
  // console.log(dataBody)
  return this.http.post(this.url+'/AgileMetric',dataBody,{headers:this.headers});
}
GetChannelMessages(teamdID,channelID,wordFrequency){
  try{
    let bodyData={
      "TeamsID":teamdID,
      "channelID":channelID,
      "wordFrequency" : wordFrequency
    };
  //return this.http.post(this.url+'/mychannelmsg',bodyData,{headers:this.headers});
  return this.http.post(this.url+'/mychannelmsg',bodyData,{headers:this.headers});
  }catch(e){
      return e;
  }
}
GetChannelDurationMessages(TteamsID,TchannelsID,lastModifiedDate,wordFrequency){
  try
  {
    let bodyData={
      "TeamsID":TteamsID,
      "channelID":TchannelsID,
      "lastModifiedDate":lastModifiedDate,
      "wordFrequency" : wordFrequency
    };
    return this.http.post(this.url+'/mychanneldurationmsg',bodyData,{headers:this.headers});
  }catch(e){
    return e;
  }
}
 


    GetToken(){
      return this.http.get('http://localhost:5000/api/gettoken',{headers:this.headers});
    }

    
    
}
