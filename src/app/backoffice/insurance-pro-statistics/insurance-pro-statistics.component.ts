import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { InsuranceProService } from 'src/app/client/insuranceProService/insurance-pro.service';

@Component({
  selector: 'app-insurance-pro-statistics',
  templateUrl: './insurance-pro-statistics.component.html',
  styleUrls: ['./insurance-pro-statistics.component.css']
})
export class InsuranceProStatisticsComponent implements OnInit {
  statistics: any;

  // Pie Chart
  pieChartLabels: string[] = [];
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartType: ChartType = 'pie';

  // Bar Chart
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Count by Type' }]
  };
  barChartType: ChartType = 'bar';

  // Line Chart
  lineChartLabels: string[] = [];
  lineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Average Premium', borderColor: '#42A5F5', fill: false }]
  };
  lineChartType: ChartType = 'line';

  // Bubble Chart
  bubbleChartData: ChartData<'bubble', { x: number; y: number; r: number }[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Premium Range' }]
  };
  bubbleChartType: ChartType = 'bubble';
  bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    }
  };

  constructor(private insuranceProService: InsuranceProService) {}

  ngOnInit(): void {
    this.insuranceProService.getAllStatistics().subscribe(
      (data) => {
        this.statistics = data;
        console.log('Statistics:', this.statistics);
        this.prepareChartData();
      },
      (error) => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  prepareChartData() {
    // Pie Chart: Percentage by Type
    this.pieChartLabels = Object.keys(this.statistics.percentageByType);
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [{ data: Object.values(this.statistics.percentageByType).map(Number) }]
    };
  
    // Bar Chart: Count by Type
    this.barChartLabels = Object.keys(this.statistics.countByType);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [{
        data: Object.values(this.statistics.countByType).map(Number), // Ensure values are numbers
        label: 'Count by Type'
      }]
    };
  
    // Line Chart: Average Premium by Type
    this.lineChartLabels = Object.keys(this.statistics.averagePremiumByType);
    this.lineChartData = {
      labels: this.lineChartLabels,
      datasets: [{
        data: Object.values(this.statistics.averagePremiumByType).map(Number), // Ensure values are numbers
        label: 'Average Premium',
        borderColor: '#42A5F5',
        fill: false
      }]
    };
  
    // Bubble Chart: Premium Range by Type
    this.bubbleChartData = {
      labels: Object.keys(this.statistics.premiumRangeByType), // Use the same labels for consistency
      datasets: [{
        data: Object.keys(this.statistics.premiumRangeByType).map((key) => ({
          x: this.statistics.premiumRangeByType[key].max, // Use max for x-axis
          y: this.statistics.premiumRangeByType[key].min, // Use min for y-axis
          r: this.statistics.premiumRangeByType[key].max / 100 // Adjust radius for better visualization
        })),
        label: 'Premium Range'
      }]
    };

    console.log('Pie Chart Data:', this.pieChartData);
console.log('Bar Chart Data:', this.barChartData);
console.log('Line Chart Data:', this.lineChartData);
console.log('Bubble Chart Data:', this.bubbleChartData);
  }
}
