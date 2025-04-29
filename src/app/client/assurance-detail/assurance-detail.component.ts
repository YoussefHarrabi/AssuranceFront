import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeAssuranceService } from '../service/DemandeAssuranceService/demande-assurance-service.service';
import { AssuranceParticular } from '../models/assurance-particular.modelV';


@Component({
  selector: 'app-assurance-detail',
  templateUrl: './assurance-detail.component.html',
  styleUrls: ['./assurance-detail.component.css']
})
export class AssuranceDetailComponent implements OnInit {
  assurance!: AssuranceParticular;

  constructor(
    private route: ActivatedRoute,
    private assuranceService: DemandeAssuranceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.assuranceService.getDemandeById(id).subscribe(data => {
      this.assurance = data;
    });
  }

  retour(): void {
    this.router.navigate(['/assurances']);
  }
}
