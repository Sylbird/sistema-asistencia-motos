import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface UserData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user = signal<UserData | null>(null);

  ngOnInit() {
    const userData = localStorage.getItem('UserData');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }
}
