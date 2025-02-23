import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-main-client',
  templateUrl: './main-client.component.html',
  styleUrls: ['./main-client.component.css']
})
export class MainClientComponent implements AfterViewInit {
  ngAfterViewInit() {
    // jQuery first as other scripts depend on it
    const jquery = document.createElement('script');
    jquery.type = 'text/javascript';
    jquery.src = '/assets/client/jquery/jquery-3.3.1.min.js';
    document.body.appendChild(jquery);

    // Load other scripts after jQuery
    jquery.onload = () => {
      // Timeline
      const timeline = document.createElement('script');
      timeline.type = 'text/javascript';
      timeline.src = '/assets/client/timeline/jquery.timelify.js';
      document.body.appendChild(timeline);

      // Circle Progress
      const circleProgress = document.createElement('script');
      circleProgress.type = 'text/javascript';
      circleProgress.src = '/assets/client/jquery-circle-progress/circle-progress.min.js';
      document.body.appendChild(circleProgress);

      // Loading Screen
      const loadingScreen = document.createElement('script');
      loadingScreen.type = 'text/javascript';
      loadingScreen.src = '/assets/client/loadscreen/js/ju-loading-screen.js';
      document.body.appendChild(loadingScreen);

      // Popper.js
      const popper = document.createElement('script');
      popper.type = 'text/javascript';
      popper.src = '/assets/client/popper/popper.min.js';
      document.body.appendChild(popper);

      // Bootstrap
      const bootstrap = document.createElement('script');
      bootstrap.type = 'text/javascript';
      bootstrap.src = '/assets/client/bootstrap/js/bootstrap.min.js';
      document.body.appendChild(bootstrap);

      // Bootstrap Navbar
      const bootstrapNavbar = document.createElement('script');
      bootstrapNavbar.type = 'text/javascript';
      bootstrapNavbar.src = '/assets/client/bootstrap/js/bootstrap-4-navbar.js';
      document.body.appendChild(bootstrapNavbar);

      // WOW.js
      const wow = document.createElement('script');
      wow.type = 'text/javascript';
      wow.src = '/assets/client/WOW-master/dist/wow.min.js';
      document.body.appendChild(wow);

      // Owl Carousel
      const owlCarousel = document.createElement('script');
      owlCarousel.type = 'text/javascript';
      owlCarousel.src = '/assets/client/owlcarousel/owl.carousel.min.js';
      document.body.appendChild(owlCarousel);

      // Ju Loading
      const juLoading = document.createElement('script');
      juLoading.type = 'text/javascript';
      juLoading.src = '/assets/client/loadscreen/js/ju-loading-screen.js';
      document.body.appendChild(juLoading);

      // Fancybox
      const fancybox = document.createElement('script');
      fancybox.type = 'text/javascript';
      fancybox.src = '/assets/client/fancybox-master/jquery.fancybox.min.js';
      document.body.appendChild(fancybox);

      // Custom JS (load this last)
      fancybox.onload = () => {
        const custom = document.createElement('script');
        custom.type = 'text/javascript';
        custom.src = '/assets/client/js/custom.js';
        document.body.appendChild(custom);

        // Add a console log to confirm all scripts are loaded
        custom.onload = () => {
          console.log('All scripts have been loaded!');
        };
      };
    };
  }
}
