import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {service} from './service';
import { HttpClientModule } from '@angular/common/http';
import { mensaje } from './Mensaje';
import * as big from 'bigint-crypto-utils'
import * as rsa from '../../../../rsa/rsa-cybersecurity';
import * as bigconv from 'bigint-conversion'

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
   
   respuesta: any;
   publicKey: any;
   privateKey: any;
   serverPublicKey: any;
   mensajeConsola: any;
   mensaje: any;

   async ngOnInit() {
 
    var mensaje = "";
    await this.claves()
    await this.dameClave()


    //paralo aquí
      // this.Service.enviarMe(mensaje)
      //   .subscribe(res => {
      //     console.log("el servidor dice: "  + res['hello']);       
  
      //   });
    
  }

  enviarMensaje() {
    this.mensajeConsola = "Hola servidor"
    this.mensaje = new mensaje(bigconv.bigintToHex(rsa.encrypt(bigconv.textToBigint(this.mensajeConsola), this.serverPublicKey[0], this.serverPublicKey[1])), bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))
    this.Service.enviarMe(this.mensaje)
      .subscribe((res: any) => {
        this.respuesta = bigconv.bigintToText(rsa.decrypt(bigconv.hexToBigint(res.respuestaServidor), this.privateKey.d, this.privateKey.publicKey.n));
        console.log(this.respuesta);
      })
    }

  async claves() {
    const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }


  dameClave() {
    this.Service.dameClave().subscribe((res: any) => {
      this.serverPublicKey = [bigconv.hexToBigint(res.e), bigconv.hexToBigint(res.n)];
      this.enviarMensaje();
    })
  }
}
