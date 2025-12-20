import { Component } from '@angular/core';
import { Api } from '../../core/services/api';

@Component({
  selector: 'app-menu-admin',
  imports: [],
  templateUrl: './menu-admin.html',
  styleUrl: './menu-admin.scss',
})
export class MenuAdmin {
  constructor(private apiService: Api) {}

  ngOnInit(): void {
    const Usuarios = this.apiService.get('/usuario');
    console.log(Usuarios);
  }
}
