import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { StatisticsService, SocieteStats } from 'src/app/client/service/Statistics/statistics.service';

@Component({
  selector: 'app-statistics-component',
  templateUrl: './statistics-component.component.html',
  styleUrls: ['./statistics-component.component.css']
})
export class StatisticsComponentComponent implements OnInit {
  stats: SocieteStats | null = null; // Ajout de la propriété stats
  barChart: any;
  pieChart: any;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getStatistiquesSociete().subscribe({
      next: (stats: SocieteStats) => {
        console.log("Statistiques récupérées :", stats);
        this.stats = stats; // Assurez-vous de stocker les statistiques
        setTimeout(() => {
          this.createBarChart(stats);
          this.createPieChart(stats);
        }, 100); // Petit délai pour s'assurer que le DOM est bien chargé
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  createBarChart(stats: SocieteStats): void {
    console.log("Création du bar chart...");

    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas barChart non trouvé !");
      return;
    }

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Payées', 'Non Payées', 'En Attente'],
        datasets: [
          {
            label: 'Montants par statut (DT)',
            data: [
              stats.montantPaye,
              stats.montantNonPaye,
              stats.montantEnAttente
            ],
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }

  createPieChart(stats: SocieteStats): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Payées', 'Non Payées', 'En Attente'],
        datasets: [{
          data: [
            stats.nombreFacturesPayees,
            stats.nombreFacturesNonPayees,
            stats.nombreFacturesEnAttente
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Répartition du nombre de factures par statut'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
