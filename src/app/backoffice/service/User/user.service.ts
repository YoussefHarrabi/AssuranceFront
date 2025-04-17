import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl2 = 'http://localhost:8089/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl2}`); // Ajustez le endpoint selon votre API Spring
  }
}
