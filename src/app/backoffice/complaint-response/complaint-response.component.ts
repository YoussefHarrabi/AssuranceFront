import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ComplaintService } from '../complaint.service';
import { Complaint } from '../models/complaint.model';
import { Response } from '../models/response.model';
import { ComplaintStatus } from '../models/complaint-status.enum';
import { User } from '../models/user.model';
import { ComplaintResponseService } from 'src/app/complaint-response.service';
import * as bootstrap from 'bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-complaint-response',
  templateUrl: './complaint-response.component.html',
  styleUrls: ['./complaint-response.component.css']
})
export class ComplaintResponseComponent implements OnInit {
  @ViewChild('responseForm') responseForm!: NgForm;
  complaint!: Complaint;
  response: Response = new Response();
  users: User[] = [];
  submittedResponse: Response | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private complaintService: ComplaintService,
    private complaintResponseService: ComplaintResponseService
  ) {
    // Initialiser complaint avec une valeur par défaut
    this.complaint = new Complaint();
  }

  async ngOnInit(): Promise<void> {
    await this.loadComplaintAndUsers();
  }

  private async loadComplaintAndUsers(): Promise<void> {
    try {
      this.isLoading = true;
      const id = Number(this.route.snapshot.paramMap.get('id'));
      
      if (isNaN(id)) {
        throw new Error('ID invalide');
      }

      // Utiliser firstValueFrom pour convertir l'Observable en Promise
      const [complaintData, usersData] = await Promise.all([
        firstValueFrom(this.complaintService.getComplaintById(id)),
        firstValueFrom(this.http.get<User[]>('http://localhost:8084/api/users'))
      ]);

      if (complaintData) {
        this.complaint = complaintData;
      }
      
      if (usersData) {
        this.users = usersData;
      }

      if (this.complaint.response) {
        this.response = { ...this.complaint.response };
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      this.showErrorModal('Impossible de charger les données nécessaires.');
    } finally {
      this.isLoading = false;
    }
  }

  submitResponse(form: NgForm): void {
    if (form.valid && this.complaint && this.complaint.id) {
      this.response.date = new Date();
      this.response.complaint = { id: this.complaint.id } as Complaint;

      this.complaintResponseService.addResponse(this.response).subscribe({
        next: (response) => {
          this.submittedResponse = response;
          this.updateComplaintStatus();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la réponse', error);
          this.showErrorModal('Une erreur est survenue lors de l\'envoi de la réponse.');
        }
      });
    }
  }

  private updateComplaintStatus(): void {
    if (this.complaint && this.response) {
      this.complaint.response = this.response;
      this.complaint.status = ComplaintStatus.RESOLVED;

      this.complaintService.updateComplaint(this.complaint).subscribe({
        next: () => {
          const modalElement = document.getElementById('successModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la réclamation', error);
          this.showErrorModal('Une erreur est survenue lors de la mise à jour de la réclamation.');
        }
      });
    }
  }

  navigateToList(): void {
    this.router.navigate(['/backoffice/reclamations']);
  }

  private showErrorModal(message: string): void {
    alert(message); // À remplacer par votre propre modal d'erreur
  }
}