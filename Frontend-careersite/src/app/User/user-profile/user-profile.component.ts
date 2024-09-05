
import { Component, OnInit,NgModule  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../service/job.service'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list'; // Import MatGridListModule

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,MatGridListModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: any;
  isModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userProfileService: JobService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      profilePicture: [''],
      highestQualification: [''],
      fieldOfStudy: [''],
      college: [''],
      graduationYear: [null],
      grades: [''],
      totalExperience: [''],
      currentEmployer: [''],
      currentPosition: [''],
      employmentHistory: [''],
      resume: [''],
      portfolio: [''],
      location: [''],
      linkedinProfile: ['']
    });
  }

  loadUserProfile(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.userProfileService.getUserProfile(userId).subscribe({
        next: data => {
          if (data) {
            this.userProfile = data;
            this.profileForm.patchValue(data);
          } else {
            // If no profile data is found, handle accordingly
            console.log('No profile found for this user.');
            this.userProfile = null;
          }
        },
        error: error => {
          if (error.status === 404) {
            // If the error is 404, the profile doesn't exist
            this.userProfile = null;
          } else {
            console.error('Error loading user profile', error);
            // Handle other errors appropriately
          }
        }
      });
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  toggleModal(): void {
    console.log("toggleModal called");
    this.isModalOpen = !this.isModalOpen;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const userId = localStorage.getItem('userId');
      const profileData = { ...this.profileForm.value, user: { id: userId } };
      this.userProfileService.createOrUpdateProfile(profileData).subscribe(
        response => {
          this.userProfile = response; // Update userProfile with the saved data
          this.toggleModal(); // Close modal
          this.loadUserProfile(); // Reload profile data to update view
        },
        error => {
          console.error('Error saving profile', error);
        }
      );
    }
  }
}