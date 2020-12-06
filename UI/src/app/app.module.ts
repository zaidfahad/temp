import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AzureDeveopComponent } from './azure-deveop/azure-deveop.component';
import {HttpClientModule} from '@angular/common/http';
import {ServicesService} from '../services/services.service';
import { SprintsDetailsComponent } from './sprints-details/sprints-details.component';
import { AzureWordCountComponent } from './azure-word-count/azure-word-count.component'
import {SafeStylePipe} from '../app/sprints-details/safe-style.pipe'
import {MiroservicesService} from '../services/miroservices/miroservices.service'
import {MiroComponent} from './miro/miro/miro.component'
//word Count 
import { TagCloudModule } from 'angular-tag-cloud-module';
import { from } from 'rxjs';

//toaster
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { KahootComponent } from './kahoot/kahoot.component';
import { MSChannelCreationsComponent } from './mschannel-creations/mschannel-creations.component';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AzureDeveopComponent,
    SprintsDetailsComponent,
    AzureWordCountComponent,
    SafeStylePipe,
    MiroComponent,
    KahootComponent,
    MSChannelCreationsComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TagCloudModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
     // ToastrModule added
  ],
  providers: [ServicesService,MiroservicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
