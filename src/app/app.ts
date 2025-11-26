import { JsonPipe } from '@angular/common';
import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = signal('imed');
  protected readonly urlParams = signal<Record<string, string>>({});

  ngOnInit(): void {
    // Capturar todos los query params
    this.route.queryParams.subscribe((params) => {
      this.urlParams.set(params);
      console.warn('URL Parameters:', params);
    });
  }

  cerrarVentana() {
    window.close();
  }
}
