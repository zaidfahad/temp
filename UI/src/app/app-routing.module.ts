import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AzureDeveopComponent } from './azure-deveop/azure-deveop.component';
import {AppComponent} from '../app/app.component';
import{SprintsDetailsComponent} from './sprints-details/sprints-details.component';
import{AzureWordCountComponent} from './azure-word-count/azure-word-count.component'
import {MiroComponent} from './miro/miro/miro.component'
import {KahootComponent} from './kahoot/kahoot.component';
import {MSChannelCreationsComponent} from './mschannel-creations/mschannel-creations.component'
const routes: Routes = 
[
  { path: 'azuredevop', component: AzureDeveopComponent },
   {path:'sprints',component:SprintsDetailsComponent},
   {path:'azurewordcount',component:AzureWordCountComponent},
   {path:'miro',component:MiroComponent},
   {path:'kahoot',component:KahootComponent},
   {path:'adminmschannels',component:MSChannelCreationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
