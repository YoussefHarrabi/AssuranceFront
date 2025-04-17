import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-notifcation-client',
  templateUrl: './notifcation-client.component.html',
  styleUrls: ['./notifcation-client.component.css']
})
export class NotifcationClientComponent implements OnInit, OnDestroy {
  notifications: string[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.getNotifications().subscribe((data: string) => {
      this.notifications.push(data);
      setTimeout(() => {
        this.notifications.shift();
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    // Disconnect WebSocket when component is destroyed
  }
}