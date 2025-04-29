import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-main-backoffice',
  templateUrl: './main-backoffice.component.html',
  styleUrls: ['./main-backoffice.component.css']
})
export class MainBackofficeComponent implements AfterViewInit {
  ngAfterViewInit() {
    // 1. jQuery first as other scripts depend on it
    const jquery = document.createElement('script');
    jquery.type = 'text/javascript';
    jquery.src = '/assets/backoffice/plugins/jquery/jquery.min.js';
    document.body.appendChild(jquery);

    // Load other scripts after jQuery
    jquery.onload = () => {
      // 2. Bootstrap tether
      const tether = document.createElement('script');
      tether.type = 'text/javascript';
      tether.src = '/assets/backoffice/plugins/bootstrap/js/tether.min.js';
      document.body.appendChild(tether);

      // 3. Bootstrap
      const bootstrap = document.createElement('script');
      bootstrap.type = 'text/javascript';
      bootstrap.src = '/assets/backoffice/plugins/bootstrap/js/bootstrap.min.js';
      document.body.appendChild(bootstrap);

      // 4. jQuery Slimscroll
      const slimscroll = document.createElement('script');
      slimscroll.type = 'text/javascript';
      slimscroll.src = '/assets/backoffice/js/jquery.slimscroll.js';
      document.body.appendChild(slimscroll);

      // 5. Waves effects
      const waves = document.createElement('script');
      waves.type = 'text/javascript';
      waves.src = '/assets/backoffice/js/waves.js';
      document.body.appendChild(waves);

      // 6. Sidebar menu
      const sidebar = document.createElement('script');
      sidebar.type = 'text/javascript';
      sidebar.src = '/assets/backoffice/js/sidebarmenu.js';
      document.body.appendChild(sidebar);

      // 7. Sticky kit
      const stickyKit = document.createElement('script');
      stickyKit.type = 'text/javascript';
      stickyKit.src = '/assets/backoffice/plugins/sticky-kit-master/dist/sticky-kit.min.js';
      document.body.appendChild(stickyKit);

      // 8. Custom JS
      const custom = document.createElement('script');
      custom.type = 'text/javascript';
      custom.src = '/assets/backoffice/js/custom.min.js';
      document.body.appendChild(custom);

      // Wait for basic UI scripts to load before loading chart-related scripts
      custom.onload = () => {
        // 9. Chartist
        const chartist = document.createElement('script');
        chartist.type = 'text/javascript';
        chartist.src = '/assets/backoffice/plugins/chartist-js/dist/chartist.min.js';
        document.body.appendChild(chartist);

        // 10. Chartist Plugin Tooltip
        const chartistTooltip = document.createElement('script');
        chartistTooltip.type = 'text/javascript';
        chartistTooltip.src = '/assets/backoffice/plugins/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.min.js';
        document.body.appendChild(chartistTooltip);

        // 11. D3.js
        const d3 = document.createElement('script');
        d3.type = 'text/javascript';
        d3.src = '/assets/backoffice/plugins/d3/d3.min.js';
        document.body.appendChild(d3);

        // 12. C3.js (depends on D3)
        d3.onload = () => {
          const c3 = document.createElement('script');
          c3.type = 'text/javascript';
          c3.src = '/assets/backoffice/plugins/c3-master/c3.min.js';
          document.body.appendChild(c3);

          // 13. Dashboard JS (load this last as it depends on all chart libraries)
          c3.onload = () => {
            const dashboard = document.createElement('script');
            dashboard.type = 'text/javascript';
            dashboard.src = '/assets/backoffice/js/dashboard1.js';
            document.body.appendChild(dashboard);

            // Add a console log to confirm all scripts are loaded
            dashboard.onload = () => {
              console.log('All dashboard scripts have been loaded!');
            };
          };
        };
      };
    };
  }
}
