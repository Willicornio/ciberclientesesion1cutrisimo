import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {service} from './service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private Service: service) {
    // route.params.subscribe(val => { // necesario para poder volver a ejecutar ngoninit al volver de otra pagina
    //   this.getUser(this.userLogin._id);
    // });
   }


   ngOnInit() {
 
      this.Service.enviarMe()
        .subscribe(res => {
          console.log("el servidor dice: "  + res['hello']);       
  
        });
    
  }
}
