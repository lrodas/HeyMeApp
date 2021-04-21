import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { GraficaBarrasResponse } from '../../interfaces/response/graficaBarrasResponse.interface';
import { DatosNotificacionPrecioResponse } from '../../interfaces/response/datosNotificacionPrecioResponse.interface';
import { PaqueteConsumoResponse } from '../../interfaces/response/paqueteConsumoResponse.interface';

import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { PaqueteService } from '../../services/paquete/paquete.service';

import { OPCION_DASHBOARD } from '../../config/config';
import { Paquete } from '../../models/paquete.model';
import { Paypal } from '../../config/functions.js';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {

  public restanteSms: number;
  public restanteWhatsapp: number;
  public restanteMail: number;
  public mailIlimitado: boolean;
  single: any[] = [];

  public paquetes: Paquete[];
  private addScript = false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Canales';
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad de mensajes';
  createPaypalButtons: boolean = true;

  colorScheme = {
    domain: ['#C2D676', '#EBBA7C', '#FF75BC', '#757DEB', '#94FFD7', '#C2D676', '#EBBA7C']
  };

  constructor(
    private notificacionService: NotificacionesService,
    public paqueteService: PaqueteService
  ) { }

  ngOnInit() {

    this.restanteWhatsapp = 0;
    this.restanteMail = 0;
    this.mailIlimitado = false;
    this.restanteSms = 0;
    this.obtenerConteoNotificacionesPorMes();
    this.obtenerNotificacionRestantes();

    this.paqueteService.obtenerPaquetesActivos(OPCION_DASHBOARD)
      .subscribe((paquetes: Paquete[]) => {
        this.paquetes = paquetes;
      });
  }

  ngAfterViewChecked() {
    console.log('entrando');
    this.createButtonPaypal();
  }

  private createButtonPaypal(): void {
    if (this.paquetes && this.paquetes.length > 0 && this.createPaypalButtons) {
      
      let buttons = [];
      for (let paquete of this.paquetes) {
        buttons.push(document.getElementById(`paypal_button_${paquete.idPaquete}`));
      }

      console.log(buttons);
      console.log(!buttons.some(el => el === null));
      
      if (!buttons.some(el => el === null)) {
        this.createPaypalButtons = false;
        Swal.fire({
          allowOutsideClick: false,
          type: 'info',
          text: 'Espere por favor',
          showConfirmButton: false
        });

        this.paqueteService.retrieveCurrentExchangeRate('')
          .subscribe(value => {
            if (value) {
              this.paquetes.forEach(paquete => {
      
                  const total = (paquete.precioGTQ / value).toFixed(2);

                  from(Paypal.fnc(total, `paypal_button_${paquete.idPaquete}`)).pipe(
                    catchError(error => {

                      Swal.close();
                      Swal.fire({
                        type: 'success',
                        title: 'Ups!',
                        text: `En estos momentos no es posible procesar tu pago, por favor intenta mas tarde`,
                        showConfirmButton: false,
                        timer: 3000
                      });
                      return error;
                    }),
                    switchMap((paypalResponse: any) => {
                      if (paypalResponse) {
                        return this.paqueteService.activarPaquete(OPCION_DASHBOARD, paquete.idPaquete, paquete.nombre, JSON.stringify(paypalResponse));
                      }
                    })
                  ).subscribe(sale => {
                    if (sale) {
                      window.location.reload();
                    } else {
                      Swal.close();
                      Swal.fire({
                        type: 'success',
                        title: 'Ups!',
                        text: `En estos momentos no es posible procesar tu pago, por favor intenta mas tarde`,
                        showConfirmButton: false,
                        timer: 3000
                      });
                    }
                  }, error => {
                    Swal.close();
                    Swal.fire({
                      type: 'success',
                      title: 'Ups!',
                      text: `En estos momentos no es posible procesar tu pago, por favor intenta mas tarde`,
                      showConfirmButton: false,
                      timer: 3000
                    });
                  });
                });
              } else {
                this.paquetes = [];
              }
          });
        Swal.close();
      }
      
    }
  }

  public obtenerConteoNotificacionesPorMes() {
    this.notificacionService.obtenerConteoNotificacionesPorMes(OPCION_DASHBOARD)
      .subscribe( (response: GraficaBarrasResponse) => {
        this.single = response.series;
      });
  }

  public obtenerPrecioNotificacionesPorMes() {
    this.notificacionService.obtenerPrecioNotificacionesPorMes(OPCION_DASHBOARD)
      .subscribe( (response: DatosNotificacionPrecioResponse) => {
        for (const dato of response.datos) {
          switch (dato.canal) {
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
    this.notificacionService.obtenerNotificacionesRestantes(OPCION_DASHBOARD, fechaFin)
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
