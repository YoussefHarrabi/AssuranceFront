import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../complaint.service';
import { Complaint } from 'src/app/client/models/complaint.model';
import { ComplaintType } from 'src/app/client/models/complaint-type.enum';
import { ComplaintStatus } from 'src/app/client/models/complaint-status.enum';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit {
  
  complaints: Complaint[] = [];
  complaintTypes = Object.values(ComplaintType);
  complaintStatuses = Object.values(ComplaintStatus);
  complaintCounts: { [key: string]: number } = {};
  statusCounts: { [key: string]: number } = {};
  stackedBarData: { [key: string]: { [key: string]: number } } = {};

  // Define a unique color palette to avoid duplicates
  colors = [
    '#FF4500', // Bright red
    '#1E90FF', // Bright blue
    '#FFD700', // Gold
    '#32CD32', // Light green
    '#8A2BE2', // Violet
    '#FF69B4', // Pink
    '#20B2AA', // Light sea green
    '#FF8C00'  // Dark orange
  ];
  

  // Bar Chart options
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Avoid overlap
          maxRotation: 45, // 45° tilt for readability
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  public barChartLabels: string[] = this.complaintTypes;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Réclamations',
      backgroundColor: this.colors,
      borderColor: '#ffffff',
      borderWidth: 1
    }
  ];

  // Pie Chart options
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public pieChartLabels: string[] = this.complaintTypes;
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      label: 'Réclamations',
      backgroundColor: this.colors
    }
  ];

  // Line Chart
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.3 // Adds a slight curve to the lines
      }
    }
  };
  public lineChartLabels: string[] = this.complaintTypes;
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartDataset<'line', number[]>[] = [
    {
      data: [],
      label: 'Réclamations',
      borderColor: '#FF4500',
      backgroundColor: 'rgba(255, 69, 0, 0.2)',
      pointBackgroundColor: '#FF4500',
      pointBorderColor: '#ffffff',
      borderWidth: 2
    }
  ];

  // Doughnut Chart for Complaint Status
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public doughnutChartLabels: string[] = this.complaintStatuses;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartDataset<'doughnut', number[]>[] = [
    {
      data: [],
      label: 'Statuts des Réclamations',
      backgroundColor: this.colors
    }
  ];

  // Bar Chart for Complaint Status
  public statusBarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Avoid overlap
          maxRotation: 45, // 45° tilt for readability
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  public statusBarChartLabels: string[] = this.complaintStatuses;
  public statusBarChartType: ChartType = 'bar';
  public statusBarChartLegend = true;
  public statusBarChartData: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Statuts des Réclamations',
      backgroundColor: this.colors,
      borderColor: '#ffffff',
      borderWidth: 1
    }
  ];

  // Stacked Bar Chart
  public stackedBarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  };
  public stackedBarChartLabels: string[] = this.complaintTypes;
  public stackedBarChartType: ChartType = 'bar';
  public stackedBarChartLegend = true;
  public stackedBarChartData: ChartDataset<'bar', number[]>[] = [];

  constructor(
    private complaintService: ComplaintService,
    private router: Router,
    private route: ActivatedRoute // Ajout de ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Écoute des changements de fragment avec ActivatedRoute
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }


  loadData(): void {
    this.complaintService.getComplaints().subscribe(data => {
      this.complaints = data;
      this.calculateComplaintCounts();
      this.calculateStatusCounts();
      this.calculateStackedBarChartData();
      this.updateChartData();
    });
  }

  calculateComplaintCounts(): void {
    this.complaintTypes.forEach(type => {
      this.complaintCounts[type] = this.complaints.filter(complaint => complaint.type === type).length;
    });
  }

  calculateStatusCounts(): void {
    this.complaintStatuses.forEach(status => {
      this.statusCounts[status] = this.complaints.filter(complaint => complaint.status === status).length;
    });
  }

  calculateStackedBarChartData(): void {
    this.complaintTypes.forEach(type => {
      this.stackedBarData[type] = {};
      this.complaintStatuses.forEach(status => {
        this.stackedBarData[type][status] = this.complaints.filter(complaint => complaint.type === type && complaint.status === status).length;
      });
    });
  }

  updateChartData(): void {
    const typeData = this.complaintTypes.map(type => this.complaintCounts[type]);
    const statusData = this.complaintStatuses.map(status => this.statusCounts[status]);

    this.barChartData[0].data = typeData;
    this.pieChartData[0].data = typeData;
    this.lineChartData[0].data = typeData;
    this.doughnutChartData[0].data = statusData;
    this.statusBarChartData[0].data = statusData;

    this.stackedBarChartData = this.complaintStatuses.map((status, index) => ({
      data: this.complaintTypes.map(type => this.stackedBarData[type][status]),
      label: status,
      backgroundColor: this.colors[index]
    }));
  }
}