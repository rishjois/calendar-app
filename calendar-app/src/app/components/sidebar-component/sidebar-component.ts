import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterLink],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss'
})
export class SidebarComponent {
  user = input<string>("");

  user_initials = computed(() => this.getInitials(this.user()));

  getInitials(user: string): string {
    const names = user
      .split(" ")
      .filter(name => name.length > 0);
  
    if (names.length === 0) {
      return "";
    }
  
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
  
    const firstInitial = names[0][0].toUpperCase();
    const lastInitial = names[names.length - 1][0].toUpperCase();
  
    return firstInitial + lastInitial;
  }
  
}
