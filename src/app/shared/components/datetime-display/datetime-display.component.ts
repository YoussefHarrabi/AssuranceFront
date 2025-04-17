import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime-display',
  templateUrl: './datetime-display.component.html',
  styleUrls: ['./datetime-display.component.css']
})
export class DatetimeDisplayComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  userLogin: string = 'Hosinusss';
  private timerInterval: any;

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  get utcDate(): string {
    const date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
}