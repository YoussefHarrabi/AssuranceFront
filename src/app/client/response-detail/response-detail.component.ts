import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComplaintResponseService } from 'src/app/complaint-response.service';
import { Complaint } from '../models/complaint.model';
import { ComplaintService } from '../complaint.service';
import { Response } from '../models/response.model';

@Component({
  selector: 'app-response-detail',
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.css']
})
export class ResponseDetailComponent implements OnInit {
  response: Response | null = null;
  noResponseMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private responseService: ComplaintResponseService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.responseService.getResponseById(id).subscribe(
      data => {
        this.response = data;
        if (!this.response) {
          this.noResponseMessage = "Vous n'avez pas encore de réponse.";
        }
      },
      error => {
        console.error('Error fetching response details', error);
        this.noResponseMessage = "Vous n'avez pas encore de réponse.";
      }
    );
  }
}