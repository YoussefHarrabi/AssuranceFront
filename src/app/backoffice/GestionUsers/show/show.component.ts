import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Models/Users/user';
import { UserService } from '../../Services/Users/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // For displaying filtered results
  currentUserLogin = 'YoussefHarrabi';
  currentTime!: string;
  searchTerm: string = '';
  searchFields: string[] = ['firstName', 'lastName', 'email', 'numberOfIdentity', 'phoneNumber']; // Fields to search in

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.updateCurrentTime();
    // Update time every second
    setInterval(() => this.updateCurrentTime(), 1000);
  }

  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.getUTCFullYear() + '-' + 
                     this.padZero(now.getUTCMonth() + 1) + '-' + 
                     this.padZero(now.getUTCDate()) + ' ' + 
                     this.padZero(now.getUTCHours()) + ':' + 
                     this.padZero(now.getUTCMinutes()) + ':' + 
                     this.padZero(now.getUTCSeconds());
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users]; // Initialize filtered users with all users
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
      }
    });
  }

  // New method to search/filter users
  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users]; // Reset to show all users if search is empty
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredUsers = this.users.filter(user => {
      // Check each search field for matches
      return this.searchFields.some(field => {
        const fieldValue = user[field];
        
        // Skip if the field doesn't exist or is null
        if (fieldValue === undefined || fieldValue === null) {
          return false;
        }
        
        // Convert field value to string and check if it contains the search term
        return String(fieldValue).toLowerCase().includes(searchTermLower);
      });
    });
  }

  // Method to clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  deleteUser(id: number): void {
    if (id === 0) {
      alert('Cannot delete user with invalid ID');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user['id'] !== id);
          this.filteredUsers = this.filteredUsers.filter(user => user['id'] !== id);
          alert('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }

  updateUser(id: number): void {
    if (id === 0) {
      alert('Cannot update user with invalid ID');
      return;
    }
    this.router.navigate(['backoffice/updateuser', id]);
  }

  promoteToAdmin(user: User): void {
    if (!user['id']) {
      alert('Cannot promote user with invalid ID');
      return;
    }
    
    if (confirm(`Are you sure you want to promote ${user['firstName']} ${user['lastName']} to admin?`)) {
      this.userService.promoteToAdmin(user).subscribe({
        next: (response) => {
          alert(`User ${user['firstName']} ${user['lastName']} has been promoted to admin`);
          this.loadUsers(); // Reload the user list to reflect changes
        },
        error: (error) => {
          console.error('Error promoting user to admin:', error);
          alert('Failed to promote user to admin. Please try again.');
        }
      });
    }
  }

  // Convert Set<Role> to string for display
  displayRoles(roles: any): string {
    if (!roles) return 'CLIENT';
    
    // If it's an array, join it
    if (Array.isArray(roles)) {
      return roles.length > 0 ? roles.join(', ') : 'CLIENT';
    }
    
    // If it's a Set, convert to array then join
    if (roles instanceof Set) {
      const rolesArray = Array.from(roles);
      return rolesArray.length > 0 ? rolesArray.join(', ') : 'CLIENT';
    }
    
    // If it's an object with values, extract and join
    if (typeof roles === 'object') {
      try {
        const rolesArray = Object.values(roles);
        return rolesArray.length > 0 ? rolesArray.join(', ') : 'CLIENT';
      } catch (e) {
        console.error('Error parsing roles:', e);
      }
    }
    
    // Fallback: stringify and return
    return String(roles) || 'CLIENT';
  }

  isAdmin(user: User): boolean {
    if (!user || !user['roles']) return false;
    
    const roles = user['roles'];
    
    // If it's an array, check directly
    if (Array.isArray(roles)) {
      return roles.includes('ADMIN');
    }
    
    // If it's an object, check values
    if (typeof roles === 'object') {
      try {
        return Object.values(roles).includes('ADMIN');
      } catch (e) {
        console.error('Error checking for ADMIN role:', e);
      }
    }
    
    // Fallback: stringify and check
    return String(roles).includes('ADMIN');
  }

  registerNewAdmin(): void {
    this.router.navigate(['/backoffice/adduser']);
  }
}