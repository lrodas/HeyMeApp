import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { GraficaBarrasResponse } from 'src/app/interfaces/response/graficaBarrasResponse.interface';
import { DatosNotificacionPrecioResponse } from 'src/app/interfaces/response/DatosNotificacionPrecioResponse.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  public precioSms: number;
  public precioWhatsapp: number;
  public precioMail: number;
  single: any[] = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Canales'
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad de mensajes';

  colorScheme = {
    domain: ['#C2D676', '#EBBA7C', '#FF75BC', '#757DEB', '#94FFD7', '#C2D676', '#EBBA7C']
  };

  constructor(
    private notificacionService: NotificacionesService
  ) { }

  ngOnInit() {

    this.precioWhatsapp = 0;
    this.precioMail = 0;
    this.precioSms = 0;
    this.obtenerConteoNotificacionesPorMes();
    this.obtenerPrecioNotificacionesPorMes();
  }

  public obtenerConteoNotificacionesPorMes() {
    this.notificacionService.obtenerConteoNotificacionesPorMes('Dashboard')
      .subscribe( (response: GraficaBarrasResponse) => {
        this.single = response.series;      
      });
  }

  public obtenerPrecioNotificacionesPorMes() {
    this.notificacionService.obtenerPrecioNotificacionesPorMes('Dashboard')
      .subscribe( (response: DatosNotificacionPrecioResponse) => {
        for (const dato of response.datos) {
          switch(dato.canal) {
            case 'MAIL':
              this.precioMail = dato.precio;
              break;
            case 'SMS':
              this.precioSms = dato.precio;
              break;
            case 'WHATSAPP':
              this.precioWhatsapp = dato.precio;
              break;
          }
        }
      });
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public onSelect(e) {

  }

}
