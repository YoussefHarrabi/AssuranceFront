import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  @Input() username: string = 'Hosinusss';
  private timerInterval: any;
  currentDateTime: string = this.getCurrentDateTime();

  ngOnInit() {
    // Mettre à jour l'heure chaque seconde
    this.timerInterval = setInterval(() => {
      this.currentDateTime = this.getCurrentDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    // Nettoyer l'intervalle à la destruction du composant
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getCurrentDateTime(): string {
    return new Date().toISOString()
                    .replace('T', ' ')
                    .split('.')[0];
  }
}