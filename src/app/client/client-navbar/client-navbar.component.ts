import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent implements OnInit {
  currentDateTime: string = '2025-04-16 17:39:29';
  currentUser: string = 'zeinebcherif';
  unreadMessages: number = 0;
  isSearchOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Vérification initiale des messages non lus
    this.checkUnreadMessages();
  }

  // Méthode pour vérifier les messages non lus (utilisée dans le template)
  hasUnreadMessages(): boolean {
    return this.unreadMessages > 0;
  }

  // Méthode pour ouvrir/fermer la recherche
  toggleSearch(open: boolean): void {
    this.isSearchOpen = open;
  }

  private checkUnreadMessages(): void {
    setInterval(() => {
      this.unreadMessages = Math.floor(Math.random() * 3);
    }, 30000);
  }
}