import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/Users/user';
import { IdentityType, Role } from 'src/app/Models/Users/enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8084/api/users';
  private authUrl = 'http://localhost:8084/api/auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    // Properly serialize the user object before sending
    const serializedUser = this.serializeUserForBackend(user);
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, serializedUser);
  }
  
  promoteToAdmin(user: User): Observable<User> {
    const userId = user['id'];
    if (!userId) {
      throw new Error("Cannot promote user with undefined ID");
    }
    return this.http.put<User>(`${this.apiUrl}/${userId}/roles`, "ADMIN");
  }

  registerAdmin(adminData: any): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register-admin`, adminData);
  }
  
  // Authentication related methods
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }
  
  getCurrentUserName(): string {
    const user = this.getCurrentUser();
    
    if (user) {
      // If the token has firstName and lastName directly
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      
      // If name claims are stored in different format
      if (user.name) {
        return user.name;
      }
      
      // If we have sub (typically email) but need to extract name
      if (user.sub) {
        // Check if sub contains name data
        if (user.sub.includes(' ')) {
          return user.sub; // If sub already has a name format like "John Doe"
        }
        
        
        // Extract name from localStorage if available
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          try {
            const profile = JSON.parse(userProfile);
            if (profile.firstName && profile.lastName) {
              return `${profile.firstName} ${profile.lastName}`;
            }
          } catch (e) {
            console.error('Error parsing user profile:', e);
          }
        }
      }
    }
    
    return 'Youssef Harrabi'; // Default fallback name
  }
  
  getCurrentUserEmail(): string {
    const user = this.getCurrentUser();
    if (user && user.sub) {
      // If sub is an email
      if (user.sub.includes('@')) {
        return user.sub;
      }
      // If email is stored separately
      if (user.email) {
        return user.email;
      }
    }
    return '';
  }
  
  getFormattedCurrentTime(): string {
    // Format current date and time in UTC
    const now = new Date();
    return now.getUTCFullYear() + '-' + 
           this.padZero(now.getUTCMonth() + 1) + '-' + 
           this.padZero(now.getUTCDate()) + ' ' + 
           this.padZero(now.getUTCHours()) + ':' + 
           this.padZero(now.getUTCMinutes()) + ':' + 
           this.padZero(now.getUTCSeconds());
  }
  
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  
  // Helper method to properly serialize User object for backend
  private serializeUserForBackend(user: User): any {
    // Create a plain object copy without type constraints
    const serialized: any = { ...user };
    
    // Convert birthday to ISO string format for backend
    if (serialized.birthday && serialized.birthday instanceof Date) {
      serialized.birthday = serialized.birthday.toISOString().split('T')[0];
    }
    
    // Handle roles specifically - convert to array for backend
    if (serialized.roles instanceof Set) {
      // Convert Set to array for JSON serialization
      serialized.roles = Array.from(serialized.roles);
    } else if (typeof serialized.roles === 'object' && serialized.roles !== null) {
      try {
        serialized.roles = Array.from(Object.values(serialized.roles));
      } catch (e) {
        console.error('Error converting roles to array:', e);
        serialized.roles = [];
      }
    }
    
    return serialized;
  }
  
  // Store user profile on login for name display
  storeUserProfile(user: User): void {
    if (user && user.firstName && user.lastName) {
      localStorage.setItem('user_profile', JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }));
    }
  }
  // Add these methods to your BackofficeUserService

isAdmin(): boolean {
  const user = this.getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Check roles in token
  if (user.roles) {
    // Handle different formats of roles in token
    if (Array.isArray(user.roles)) {
      return user.roles.includes('ADMIN');
    } else if (typeof user.roles === 'string') {
      return user.roles.includes('ADMIN');
    } else if (typeof user.roles === 'object') {
      try {
        return Object.values(user.roles).includes('ADMIN');
      } catch (e) {
        console.error('Error checking admin role:', e);
      }
    }
  }
  
  // Check user profile in localStorage as fallback
  const userProfile = localStorage.getItem('backoffice_user_profile');
  if (userProfile) {
    try {
      const profile = JSON.parse(userProfile);
      if (profile.roles) {
        if (Array.isArray(profile.roles)) {
          return profile.roles.includes('ADMIN');
        } else if (typeof profile.roles === 'string') {
          return profile.roles.includes('ADMIN');
        } else if (typeof profile.roles === 'object') {
          return Object.values(profile.roles).includes('ADMIN');
        }
      }
    } catch (e) {
      console.error('Error parsing user profile for admin check:', e);
    }
  }
  
  return false;
}

}