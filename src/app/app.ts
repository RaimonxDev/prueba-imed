import { JsonPipe } from '@angular/common';
import { Component, signal, OnInit, inject, OnDestroy, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = signal('imed');
  protected readonly urlParams = signal<Record<string, string>>({});

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly autoCloseSeconds = 10; // Segundos para el auto cierre

  timeRemaining = signal(0);
  activarAutoClose = signal(false);

  constructor() {
    // Effect para reaccionar a cambios en activarAutoClose
    effect(() => {
      if (this.activarAutoClose()) {
        this.startAutoClose();
      } else {
        this.stopAutoClose();
      }
    });
  }

  ngOnInit(): void {
    // Capturar todos los query params
    this.route.queryParams.subscribe((params) => {
      this.urlParams.set(params);
      console.warn('URL Parameters:', params);
    });

    // Restaurar el estado del autoClose desde localStorage
    const savedAutoClose = localStorage.getItem('autoClose');
    if (savedAutoClose === 'true') {
      this.activarAutoClose.set(true);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoClose();
  }

  toggleAutoClose(): void {
    this.activarAutoClose.set(!this.activarAutoClose());
    localStorage.setItem('autoClose', this.activarAutoClose().toString());
  }

  private startAutoClose(): void {
    // Limpiar cualquier intervalo previo
    this.stopAutoClose();

    // Iniciar el contador
    this.timeRemaining.set(this.autoCloseSeconds);

    this.intervalId = setInterval(() => {
      const remaining = this.timeRemaining() - 1;

      if (remaining <= 0) {
        this.stopAutoClose();
        this.cerrarVentana();
      } else {
        this.timeRemaining.set(remaining);
      }
    }, 1000);
  }

  private stopAutoClose(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.timeRemaining.set(0);
  }

  cerrarVentana(): void {
    window.close();
  }
}
