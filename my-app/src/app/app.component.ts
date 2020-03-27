import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {service} from './service';
import { HttpClientModule } from '@angular/common/http';
import { mensaje } from './Mensaje';
import * as big from 'bigint-crypto-utils'
import * as rsa from '../../../../rsa2/rsa-cybersecurity';
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
   publicKey: rsa.PublicKey;
  privateKey: rsa.PrivateKey;
  serverPublicKey: rsa.PublicKey;
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
    this.mensajeConsola = "Hola servidor!"
    console.log(this.mensajeConsola);
    this.mensaje = new mensaje(bigconv.bigintToHex(this.serverPublicKey.encrypt(bigconv.textToBigint(this.mensajeConsola))),bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.Service.enviarMe(this.mensaje)
      .subscribe((res: any) => {
        this.respuesta = bigconv.bigintToText(this.privateKey.decrypt(bigconv.hexToBigint(res.respuestaServidor)))
        console.log(this.respuesta);
      });
  }

  async claves() {
    const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  dameClave() {
    this.Service.dameClave().subscribe((res: any) => {
      this.serverPublicKey = new rsa.PublicKey(bigconv.hexToBigint(res.e),bigconv.hexToBigint(res.n))
    })
  }


  async firmaCiega() {
    var r = await big.prime(3072);
    //var r = BigInt(Math.floor(Math.random() * 2000000) + 1  )
    var me = "HOLA"
    var m = bigconv.textToBigint(me);
    

    var bm = this.blindMessage(m,r,this.serverPublicKey.e,this.serverPublicKey.n)
    
    this.mensaje = new mensaje(bigconv.bigintToHex(bm),bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.Service.firmaCiega(this.mensaje)
      .subscribe((res: any) => {
        bm = this.verifyBlindSignature(bigconv.hexToBigint(res.respuestaServidor),r,this.serverPublicKey.e,this.serverPublicKey.n);
        this.respuesta = bigconv.bigintToText(this.serverPublicKey.verify(bm))

      });
  }

  blindMessage(m: bigint, r: bigint, e: bigint, n: bigint){
    var ReModn = big.modPow(r,e,n);
    var bm = (m * ReModn) % n;

    return bm;

  }

  verifyBlindSignature(bs: bigint, r: bigint, e: bigint, n: bigint){
    var rInvmodn = big.modInv(r,n);

    var bm = (bs*rInvmodn) % n;

    return bm;

  }


}
