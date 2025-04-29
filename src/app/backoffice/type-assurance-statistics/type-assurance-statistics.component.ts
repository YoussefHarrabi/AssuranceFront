import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { TypeAssuranceService } from '../service/TypeAssuranceService/type-assurance-service.service';

@Component({
  selector: 'app-type-assurance-statistics',
  templateUrl: './type-assurance-statistics.component.html',
  styleUrls: ['./type-assurance-statistics.component.css']
})
export class TypeAssuranceStatisticsComponent implements OnInit {
  chart: any;
  chartType: ChartType = 'bar'; // Default chart type is 'bar'
  chartTypes: ChartType[] = ['bar', 'pie', 'doughnut', 'line', 'radar', 'polarArea'];

  constructor(private typeAssuranceService: TypeAssuranceService) {
    // Register chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart(): void {
    this.typeAssuranceService.getTypeAssuranceStatistics().subscribe(
      (data) => {
        this.createChart(data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des statistiques', error);
      }
    );
  }

  createChart(data: { [key: string]: number }): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    // Create the chart
    this.chart = new Chart('canvas', {
      type: this.chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nombre de demandes',
            data: values,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Re-trigger the chart update after the chart is created
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    }, 500);
  }

  onChartTypeChange(): void {
    this.loadChart(); // Reload chart on type change
  }
}
