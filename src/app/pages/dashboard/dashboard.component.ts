import { Component, OnInit } from '@angular/core';

import { GraficaBarrasResponse } from '../../interfaces/response/graficaBarrasResponse.interface';
import { DatosNotificacionPrecioResponse } from '../../interfaces/response/datosNotificacionPrecioResponse.interface';
import { PaqueteConsumoResponse } from '../../interfaces/response/paqueteConsumoResponse.interface';

import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { PaqueteService } from '../../services/paquete/paquete.service';

import { OPCION_DASHBOARD, PAYPAL_CLIENT_ID } from '../../config/config';
import { Paquete } from '../../models/paquete.model';
import Swal from 'sweetalert2';

declare var paypal;

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

  public paquetes: Paquete[];
  private addScript = false;

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
    const self = this;

    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        this.paqueteService.obtenerPaquetesActivos(OPCION_DASHBOARD)
          .subscribe((paquetes: Paquete[]) => {
            this.paquetes = paquetes;
            setTimeout(() => {
              this.paquetes.forEach(paquete => {
                paypal
                  .Buttons({
                    style: {
                      shape: 'pill',
                      color: 'silver',
                      layout: 'horizontal',
                      label: 'pay',
                      tagline: true
                    },
                    createOrder: function(data, actions) {
                      return actions.order.create({
                          purchase_units: [{
                              amount: {
                                  value: paquete.precioUSD
                              }
                          }]
                      });
                    },
                    onApprove: function(data, actions) {
                      return actions.order.capture().then(function(details) {

                          self.paqueteService.activarPaquete(OPCION_DASHBOARD, paquete.idPaquete, paquete.nombre, JSON.stringify(details))
                            .subscribe( response => {
                              if (!response) {
                                Swal.fire({
                                  type: 'error',
                                  title: 'Error al activar paquete',
                                  text: `No hemos podido activar el paquete: ${paquete.nombre}, por favor contacta con soporte`,
                                  showConfirmButton: false,
                                  timer: 3000
                                });
                              }
                            });
                      });
                    }
                  })
                  .render(document.getElementById('paypal_button_' + paquete.idPaquete));
                });
            }, 3000);
          });
      });
    }
    
  }

  private addPaypalScript() {
    this.addScript = true;

    return new Promise((resolve, reject) => {
      let scriptTagElement = document.createElement('script');
      scriptTagElement.src =  `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      scriptTagElement.setAttribute('data-sdk-integration-source', 'button-factory');
      scriptTagElement.onload = resolve;
      document.body.appendChild(scriptTagElement);
    });
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
