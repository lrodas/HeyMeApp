import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { GraficaBarrasResponse } from 'src/app/interfaces/response/graficaBarrasResponse.interface';
import { DatosNotificacionPrecioResponse } from 'src/app/interfaces/response/datosNotificacionPrecioResponse.interface';
import { PaqueteConsumoResponse } from '../../interfaces/response/paqueteConsumoResponse.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  public restanteSms: number;
  public restanteWhatsapp: number;
  public restanteMail: number;
  public mailIlimitado: Boolean;
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

    this.restanteWhatsapp = 0;
    this.restanteMail = 0;
    this.mailIlimitado = false;
    this.restanteSms = 0;
    this.obtenerConteoNotificacionesPorMes();
    this.obtenerNotificacionRestantes();
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
              this.restanteMail = dato.precio;
              break;
            case 'SMS':
              this.restanteSms = dato.precio;
              break;
            case 'WHATSAPP':
              this.restanteWhatsapp = dato.precio;
              break;
          }
        }
      });
  }

  public obtenerNotificacionRestantes() {

    const fechaFin = new Date(new Date().getFullYear(), (new Date().getMonth() + 1), 0);
    this.notificacionService.obtenerNotificacionesRestantes('Dashboard', fechaFin)
      .subscribe( (response: PaqueteConsumoResponse) => {
        if (response.indicador === 'SUCCESS') {
          this.restanteSms = response.paqueteActivo.cantidadMensajes;
          this.restanteWhatsapp = response.paqueteActivo.cantidadWhatsapp;

          if (response.paqueteActivo.cantidadCorreo === -1) {
            this.restanteMail = 0;
            this.mailIlimitado = true;
          } else {
            this.mailIlimitado = false;
            this.restanteMail = response.paqueteActivo.cantidadCorreo;
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
