import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { MainClientComponent } from './main-client/main-client.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client-footer/client-footer.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';
import { ResponseDetailComponent } from './response-detail/response-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NotifcationClientComponent } from './notifcation-client/notifcation-client.component';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '../shared';
import { GeminiChatbotComponent } from './gemini-chatbot/gemini-chatbot.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { MaterialModule } from '../shared/material.module';
import { AddReviewComponent } from './add-review/add-review.component';

// Imports Material supplémentaires nécessaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    NotifcationClientComponent,
    ChatComponent,
    GeminiChatbotComponent,
    ReviewListComponent,
    AddReviewComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    // Ajout des modules Material supplémentaires
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,


    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  
    MatChipsModule,
    MatTooltipModule
  ],
  exports: [ChatComponent]
})
export class ClientModule { }