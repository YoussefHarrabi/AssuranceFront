import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ComplaintService } from '../complaint.service';
import { Complaint } from '../models/complaint.model';
import { Response } from '../models/response.model';
import { ComplaintStatus } from '../models/complaint-status.enum';
import { User } from '../models/user.model';
import { ComplaintResponseService } from 'src/app/complaint-response.service';

@Component({
  selector: 'app-complaint-response',
  templateUrl: './complaint-response.component.html',
  styleUrls: ['./complaint-response.component.css']
})
export class ComplaintResponseComponent implements OnInit {
  complaint!: Complaint;
  response: Response = new Response();
  users: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private complaintService: ComplaintService,
    private complaintResponseService: ComplaintResponseService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.complaintService.getComplaintById(id).subscribe(
      complaint => {
        this.complaint = complaint;
        if (this.complaint.response) {
          this.response = { ...this.complaint.response }; // Pré-remplit si une réponse existe
        }
      },
      error => {
        console.error('Erreur lors du chargement de la réclamation', error);
        alert('Impossible de charger la réclamation.');
      }
    );

    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:8084/api/users').subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs', error);
        alert('Impossible de charger la liste des utilisateurs.');
      }
    );
  }

  submitResponse(): void {
    if (!this.response.content || !this.response.advisor) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.response.date = new Date();
    this.response.complaint = { id: this.complaint.id } as Complaint; // Envoie uniquement l'ID pour éviter les erreurs de sérialisation

    this.complaintResponseService.addResponse(this.response).subscribe(
      response => {
        this.response = response;
        this.updateComplaintStatus();
      },
      error => {
        console.error('Erreur lors de l\'ajout de la réponse', error);
        alert(`Erreur lors de l'ajout de la réponse : ${error.message || error.statusText}`);
      }
    );
  }

  private updateComplaintStatus(): void {
    this.complaint.response = this.response;
    this.complaint.status = ComplaintStatus.RESOLVED; // Mettre à jour le statut

    this.complaintService.updateComplaint(this.complaint).subscribe(
      () => {
        alert('Réponse soumise avec succès.');
        this.router.navigate(['/backoffice/reclamations']);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la réclamation', error);
        alert('Une erreur est survenue lors de la mise à jour de la réclamation.');
      }
    );
  }
}