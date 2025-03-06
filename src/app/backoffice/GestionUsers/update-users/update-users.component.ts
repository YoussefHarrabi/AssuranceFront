import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../Services/Users/user.service';
import { User } from 'src/app/Models/Users/user';
import { IdentityType, Role } from 'src/app/Models/Users/enum';

@Component({
  selector: 'app-update-users',
  templateUrl: './update-users.component.html',
  styleUrls: ['./update-users.component.css']
})
export class UpdateUsersComponent implements OnInit {
  userForm!: FormGroup;
  userId: number;
  submitted = false;
  loading = false;
  error = '';
  currentUserLogin = 'YoussefHarrabi';
  currentTime: string;
  originalUser: User | null = null;

  // Use the proper enum instead of a string array
  identityTypes = Object.values(IdentityType);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    // Format current date and time in UTC
    const now = new Date();
    this.currentTime = now.getUTCFullYear() + '-' + 
                       this.padZero(now.getUTCMonth() + 1) + '-' + 
                       this.padZero(now.getUTCDate()) + ' ' + 
                       this.padZero(now.getUTCHours()) + ':' + 
                       this.padZero(now.getUTCMinutes()) + ':' + 
                       this.padZero(now.getUTCSeconds());

    // Get user ID from route parameter
    this.userId = +this.route.snapshot.params['id'];
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: [null, Validators.required],
      identityType: ['', Validators.required],
      numberOfIdentity: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['']
    });

    // Load user data
    this.loadUserData();
  }

  // Convenience getter for easy access to form fields
  get f(): any { return this.userForm.controls; }

  loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.loading = false;
        this.originalUser = user; // Store the original user for later
        
        // Format date for the date input (convert Date to YYYY-MM-DD)
        let formattedBirthday: string | null = null;
        
        if (user['birthday']) {
          // Handle different date formats
          const birthdayDate = new Date(user['birthday']);
          if (!isNaN(birthdayDate.getTime())) {  // Check if valid date
            formattedBirthday = birthdayDate.toISOString().split('T')[0];
          }
        }

        this.userForm.patchValue({
          firstName: user['firstName'],
          lastName: user['lastName'],
          email: user['email'],
          birthday: formattedBirthday,
          identityType: user['identityType'],
          numberOfIdentity: user['numberOfIdentity'],
          phoneNumber: user['phoneNumber'],
          address: user['address'] || ''
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load user data. Please try again.';
        console.error('Error loading user:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Get form values
    const formValues = this.userForm.value;
    
    // Convert string date to Date object
    let birthday: Date | null = null;
    if (formValues.birthday) {
      birthday = new Date(formValues.birthday);
    }
    
    // Create updated user object while preserving original roles
    const updatedUser = new User({
      id: this.userId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      birthday: birthday || new Date(), // Use the converted date or fallback
      identityType: formValues.identityType,
      numberOfIdentity: formValues.numberOfIdentity,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      // Preserve original roles if they exist
      roles: this.originalUser && this.originalUser['roles'] ? this.originalUser['roles'] : new Set<Role>(),
      // Include password if it exists in originalUser
      password: this.originalUser && this.originalUser['password'] ? this.originalUser['password'] : ''
    });

    // Use a proper serialization method to ensure roles are sent as an array
    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        this.loading = false;
        alert('User updated successfully!');
        this.router.navigate(['backoffice/users']);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to update user. Please try again.';
        console.error('Error updating user:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}