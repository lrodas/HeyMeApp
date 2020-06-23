import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.css']
})
export class CardStatsComponent implements OnInit {

  @Input() titulo: string;
  @Input() icono: string;
  @Input() descripcion: string;
  @Input() cantidad: string;

  constructor() { }

  ngOnInit() {
  }

}
