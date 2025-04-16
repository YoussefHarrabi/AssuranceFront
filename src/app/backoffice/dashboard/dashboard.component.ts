import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Dashboard statistics
  dashboardStats: any = {};
  userStats: any = {};
  recentUsers: any[] = [];
  userActivity: any = {};
  incompleteProfiles: any = {};
  
  // Date & time
  currentDateTime: string = '2025-04-16 17:09:44';
  
  // Loading states
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Add resize event listener
    window.addEventListener('resize', () => {
      if (!this.loading && !this.errorMessage) {
        this.initCharts();
      }
    });
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loading completes
  }

  /**
   * Loads all dashboard data from API
   */
  loadDashboardData(): void {
    this.loading = true;
    
    // Get dashboard overview
    this.http.get('http://localhost:8084/api/admin/statistics/dashboard')
      .subscribe({
        next: (data: any) => {
          this.dashboardStats = data;
          this.loadDetailedStats();
        },
        error: (error) => {
          this.errorMessage = 'Failed to load dashboard statistics';
          this.loading = false;
          console.error('Dashboard statistics error:', error);
        }
      });
  }

  /**
   * Loads detailed user statistics
   */
  loadDetailedStats(): void {
    // Get detailed user statistics
    this.http.get('http://localhost:8084/api/admin/statistics/users')
      .subscribe({
        next: (data: any) => {
          this.userStats = data;
          this.recentUsers = data.recentUsers?.users || [];
          this.loadUserActivity();
        },
        error: (error) => {
          this.errorMessage = 'Failed to load user statistics';
          this.loading = false;
          console.error('User statistics error:', error);
        }
      });
  }

  /**
   * Loads user activity data
   */
  loadUserActivity(): void {
    // Get user activity
    this.http.get('http://localhost:8084/api/admin/statistics/users/activity?days=180')
      .subscribe({
        next: (data: any) => {
          this.userActivity = data;
          this.loadIncompleteProfiles();
        },
        error: (error) => {
          this.errorMessage = 'Failed to load user activity';
          this.loading = false;
          console.error('User activity error:', error);
        }
      });
  }

  /**
   * Loads incomplete profile data
   */
  loadIncompleteProfiles(): void {
    // Get incomplete profile data
    this.http.get('http://localhost:8084/api/admin/statistics/users/incomplete-profiles')
      .subscribe({
        next: (data: any) => {
          this.incompleteProfiles = data;
          this.loading = false;
          
          // Wait for DOM to be updated with the loaded data before initializing charts
          setTimeout(() => {
            this.initCharts();
          }, 100);
        },
        error: (error) => {
          this.errorMessage = 'Failed to load incomplete profiles data';
          this.loading = false;
          console.error('Incomplete profiles error:', error);
        }
      });
  }

  /**
   * Initialize charts after data is loaded
   */
  initCharts(): void {
    this.initIncompleteProfilesChart();
    this.initUserActivityChart();
    this.initMfaAdoptionChart();
    this.addCustomTooltips();
  }

  /**
   * Initialize Incomplete Profiles Chart using Chartist
   */
  initIncompleteProfilesChart(): void {
    if (!this.incompleteProfiles?.users) return;

    const element = document.getElementById('userRolesChart');
    if (!element) return;

    // Group users by days since registration
    const groupedData: {[key: string]: number} = {};
    
    // Initialize with some default day ranges
    groupedData['1-7 days'] = 0;
    groupedData['8-30 days'] = 0;
    groupedData['31-90 days'] = 0;
    groupedData['91+ days'] = 0;

    // Group users by days since registration
    this.incompleteProfiles.users.forEach((user: any) => {
      const days = user.daysSinceRegistration;
      
      if (days <= 7) {
        groupedData['1-7 days']++;
      } else if (days <= 30) {
        groupedData['8-30 days']++;
      } else if (days <= 90) {
        groupedData['31-90 days']++;
      } else {
        groupedData['91+ days']++;
      }
    });

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);
    
    // Create a line chart for incomplete profiles
    const chart = new Chartist.LineChart('#userRolesChart', {
      labels: labels,
      series: [data]
    }, {
      fullWidth: true,
      chartPadding: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0.2
      }),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value) => value.toString()
      },
      low: 0
    });

    chart.on('draw', (data: any) => {
      if(data.type === 'line') {
        data.element.animate({
          d: {
            begin: 1000,
            dur: 1000,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        data.element.animate({
          opacity: {
            begin: (data.index * 80),
            dur: 500,
            from: 0,
            to: 1,
            easing: 'ease'
          },
          x1: {
            begin: (data.index * 80),
            dur: 500,
            from: data.x - 10,
            to: data.x,
            easing: 'ease'
          }
        });
        
        // Style the points with different colors based on age
        const colors = ['#26c6da', '#1e88e5', '#745af2', '#ef5350'];
        data.element.attr({
          style: `stroke: ${colors[data.index % colors.length]}; stroke-width: 8px; fill: white;`
        });
        
        // Add data value as attribute for tooltip
        if (labels[data.index] && data.value !== undefined) {
          data.element.attr({
            'data-tooltip': `${labels[data.index]}: ${data.value.y} users`
          });
        }
      }
    });
  }

  /**
   * Initialize User Activity Chart using Chartist
   */
  initUserActivityChart(): void {
    if (!this.userActivity.dailyActivity) return;

    const element = document.getElementById('userActivityChart');
    if (!element) return;

    const labels = this.userActivity.dailyActivity.map((item: any) => item.date);
    const series = [this.userActivity.dailyActivity.map((item: any) => item.count)];
    
    // Create a line chart for user activity with improved styling
    const chart = new Chartist.LineChart('#userActivityChart', {
      labels: labels,
      series: series
    }, {
      fullWidth: true,
      chartPadding: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0.2
      }),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value) => value.toString()
      },
      low: 0,
      showArea: true
    });

    chart.on('draw', (data: any) => {
      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 1000,
            dur: 1000,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        data.element.animate({
          opacity: {
            begin: (data.index * 80),
            dur: 500,
            from: 0,
            to: 1,
            easing: 'ease'
          },
          x1: {
            begin: (data.index * 80),
            dur: 500,
            from: data.x - 10,
            to: data.x,
            easing: 'ease'
          }
        });
        
        // Style the points
        data.element.attr({
          style: 'stroke: #26c6da; stroke-width: 8px; fill: white;'
        });
        
        // Add data value as attribute for tooltip
        if (labels[data.index] && series[0][data.index] !== undefined) {
          data.element.attr({
            'data-tooltip': `${labels[data.index]}: ${series[0][data.index]} registrations`
          });
        }
      }
    });
  }

  /**
   * Initialize MFA Adoption Chart using Chartist (using a bar chart)
   */
  initMfaAdoptionChart(): void {
    if (!this.userStats.mfaStatusDistribution) return;
    
    const element = document.getElementById('visitor');
    if (!element) return;
    
    const enabledCount = this.userStats.mfaStatusDistribution['Enabled'] || 0;
    const disabledCount = this.userStats.mfaStatusDistribution['Disabled'] || 0;
    
    // Create a bar chart for MFA adoption
    const chart = new Chartist.BarChart('#visitor', {
      labels: ['MFA Enabled', 'MFA Disabled'],
      series: [[enabledCount, disabledCount]]
    }, {
      high: Math.max(enabledCount, disabledCount) * 1.2, // Set high value with some padding
      low: 0,
      chartPadding: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value) => value.toString()
      }
    });

    chart.on('draw', (data: any) => {
      if(data.type === 'bar') {
        // Apply animation to bars
        data.element.animate({
          opacity: {
            begin: ((data.index + 1) * 200),
            dur: 500,
            from: 0,
            to: 1
          },
          y2: {
            begin: 0,
            dur: 500,
            from: data.y1,
            to: data.y2,
            easing: 'easeOutQuart'
          }
        });
        
        // Set colors for the bars
        if (data.index === 0) {
          data.element.attr({
            style: 'stroke: #00c292; stroke-width: 40px;',  // Green for enabled
            'data-tooltip': `MFA Enabled: ${enabledCount} users`
          });
        } else {
          data.element.attr({
            style: 'stroke: #ef5350; stroke-width: 40px;',  // Red for disabled
            'data-tooltip': `MFA Disabled: ${disabledCount} users`
          });
        }
      }
    });
  }

  /**
   * Add custom tooltip functionality without using plugins
   */
  addCustomTooltips(): void {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);

    // Add tooltip functionality to all chart elements with data-tooltip attribute
    const chartElements = document.querySelectorAll('[data-tooltip]');
    
    chartElements.forEach((element: any) => {
      // Show tooltip on mouseover
      element.addEventListener('mouseover', function(this: HTMLElement, event: any) {
        const tooltipText = this.getAttribute('data-tooltip');
        tooltip.textContent = tooltipText;
        tooltip.style.display = 'block';
        
        // Position tooltip near mouse cursor
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
      });
      
      // Move tooltip with mouse
      element.addEventListener('mousemove', function(this: HTMLElement, event: any) {
        // Adjust tooltip position with mouse
        const offset = 20;
        tooltip.style.left = (event.pageX) + 'px';
        tooltip.style.top = (event.pageY - tooltip.offsetHeight - offset) + 'px';
      });
      
      // Hide tooltip on mouseout
      element.addEventListener('mouseout', function(this: HTMLElement) {
        tooltip.style.display = 'none';
      });
    });
  }

  /**
   * Helper method to get geographical distribution as entries
   */
  getGeoDistributionEntries(): [string, number][] {
    if (!this.dashboardStats.geographicalDistribution) return [];
    return Object.entries(this.dashboardStats.geographicalDistribution) as [string, number][];
  }

  /**
   * Helper method to calculate percentage
   */
  calculatePercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }
}