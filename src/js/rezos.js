export class rezo {
constructor(nombre , hora ){
    this._nombre = nombre;
    this._hora = hora;
  
}

get nombre(){
    return this._nombre;
}

get hora(){
    return this._hora;
}



set nombre(nombre){
    this._nombre = nombre;
}

set hora(hora){
    this._hora = hora;
}



}