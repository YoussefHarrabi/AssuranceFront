import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { FormsModule } from '@angular/forms';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';
import { ResponseDetailComponent } from './response-detail/response-detail.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    HomeComponent,
    MainClientComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    AddReclamationComponent,
    ReclamationListComponent,
    EditReclamationComponent,
    ResponseDetailComponent,
    
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    CKEditorModule,
    HttpClientModule,

    
  ]
})
export class ClientModule { }
