import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-inicios',
  templateUrl: './inicios.component.html',
  styleUrls: ['./inicios.component.css']
})
export class IniciosComponent implements OnInit {

  constructor( public auth :AuthService) { }

  ngOnInit(): void {
  }

}
