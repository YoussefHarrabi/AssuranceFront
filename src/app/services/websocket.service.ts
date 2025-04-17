import { Injectable } from '@angular/core';
import { Client, Stomp, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private notificationSubject: Subject<string> = new Subject<string>();
  private subscription!: StompSubscription;

  constructor() {
    this.stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
    this.stompClient.onConnect = (frame: any) => {
      console.log('Connected: ' + frame);
      this.subscription = this.stompClient.subscribe('/topic/notifications', (message) => {
        if (message.body) {
          this.notificationSubject.next(message.body);
        }
      });
    };
    this.stompClient.activate();
  }

  getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable();
  }

  sendNotification(message: string) {
    this.stompClient.publish({destination: '/app/sendNotification', body: message});
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.stompClient.deactivate();
    }
  }
}