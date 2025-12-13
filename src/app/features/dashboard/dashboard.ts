import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/service';

@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatListModule, MatIconModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private authService: AuthService) {}

  onLogOut(): void {
    this.authService.logout();
  }
}
