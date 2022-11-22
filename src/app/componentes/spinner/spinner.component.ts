import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  show() {
    throw new Error('Method not implemented.');
  }

  isLoading = this.SpinnerComponent.isLoading;
  
  constructor(private SpinnerComponent:SpinnerComponent) { }   

  ngOnInit(): void {    
  }  
}
