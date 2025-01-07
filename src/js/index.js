let dates = document.getElementById("date");
let islamicdate = document.getElementById("islamicdate");
let location = document.getElementById("location");
let nextpray = document.getElementById("nextpray")
let containerrezos = document.getElementById("containerrezos");
import { rezo } from "./rezos.js";
//la api de la ubicacion . 
let Apykey = "5dc35062d614a1ff488ffe51947b9fc8";
 export let lat = null;
 export let lon = null;
//los rezos del dia con sus respectivo horas 
let rezosdeldia =[];
export let diag = null;
export let mesg = null;
export let añog = null;
//fecha gregoriana 
export let  Gregoriano = ()=> {
  let dateactual = new Date();
   let dia = dateactual.getDate();
  let mes = dateactual.getMonth() + 1; 
  let año = dateactual.getFullYear();
  let cadena = ` ${dia} / ${mes} / ${año}`;
  diag = dia;
  mesg = mes;
  añog = año;
  return cadena;
}




//peticion al la fecha islamica dondole el dia el mes y el año gregoriano 
 export const peticionApihijricalendario = () =>{
    return fetch (`http://api.aladhan.com/v1/gToH/${diag}-${mesg}-${añog}`)
    .then((response) => response.json())
    .then((json) => json);
};

export const getfechahijri = async () => {
  let fechahijri = await peticionApihijricalendario();
  return fechahijri;
};
// imprimir el dia el mes y el año islamico 
let imprimirfechahijri = async () => {
  let fechahijri = await getfechahijri();
  let año = fechahijri.data.hijri.year; 
  let dia = fechahijri.data.hijri.day; 
  let mes = fechahijri.data.hijri.month.number; 
  islamicdate.textContent = `${dia} / ${mes} / ${año}`;
};






//coordenadas api nativa 
export let coordenadas = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
       lon = position.coords.longitude;
      console.log(`latitud : ${lat} , longuitud : ${lon}`); 
      callback();
      
    });
  } else {
    console.log("No se permitió.");
  }
};
//api privada que de nombres de los sitios (regiones , paises y areas administrativas ) diarios que nesecita la alt y lon actual y la apykey 
const peticionApipositionstack = () => {
  return fetch(`http://api.positionstack.com/v1/reverse?access_key=${Apykey}&query=${lat},${lon}`)
    .then((response) => response.json())
    .then((json) => json);
};
let ubicacion = null;
//imprimir ubicacion a la primera y despues de carga des el localsotorage para no ahcer todo el rato peticiones a la api . 
const getplace = async () => {
  ubicacion = JSON.parse(localStorage.getItem('ubi'));
  if (ubicacion == null) {
    let ubicaciondata = await peticionApipositionstack();
    imprimirUbicacion(ubicaciondata);
  } else {
    imprimirUbicacion();
  }
};
//imprimir ubicacion . 

let imprimirUbicacion = (ubi) => {
  if (ubi) {
    let pais = ubi.data[0].country;
    let region = ubi.data[0].administrative_area;
    let ciudad = ubi.data[0].region;
    ubicacion = `${pais} / ${ciudad} / ${region}`;
    localStorage.setItem('ubi', JSON.stringify(ubicacion));
  }
  location.textContent = ubicacion;
};









// rezos diarios seguen el lugar en donde se este para ello se da la lat y lon 
const peticionApirezos = () =>{
  
  return fetch(`http://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`)  
  .then((response) => response.json())
  .then((json) => json);

}

const getrezos = async () => {
  let rezosdata = await peticionApirezos();
 
  rezosdehoy(rezosdata.data.timings); 
};
//añadir los rezos al array y meterlos en el localstorage. 
let rezosdehoy = (data)=>{

  rezosdeldia.push( 
    new rezo("FAJR", data.Fajr),
   new rezo("AMANECER", data.Sunrise),
   new rezo("DUHR", data.Dhuhr), 
   new rezo("ASR", data.Asr), 
   new rezo("MAGRIB", data.Maghrib), 
   new rezo("ISHA", data.Isha) ); 
  

   localStorage.setItem('rezosdeldia', JSON.stringify(rezosdeldia));

}

//calcualr el sigueinte rezo dependiendo d ela hora actual . 
let siguienterezo = () => {
  let rezoshoy = JSON.parse(localStorage.getItem('rezosdeldia'));
  let horaActual = horaactual();

  for (let i = 0; i < rezoshoy.length; i++) {
    if (horaActual < rezoshoy[i]._hora) {
      return rezoshoy[i];
    }
  }

  // si el ultimo rezo ya fue devulvera el primer rezo del dia siguiente . 
  return rezoshoy[0];
};

let horaactual = () => {
  let date = new Date();
  let horas = date.getHours();
  let minutos = date.getMinutes();
  let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  return horaFormateada;
};



let imprimirrezo = ()=>{
  let rezo = siguienterezo();
  nextpray.textContent = `${rezo._nombre} a las ${rezo._hora}`; 
}


let rezosdeldialocalsotaje = JSON.parse(localStorage.getItem('rezosdeldia'));


//los rezos del dia actual siempre son 6 
let imprimirezos = ()=>{
    containerrezos.innerHTML = "";
    let fragment = document.createDocumentFragment();
    rezosdeldialocalsotaje.forEach(element => {
    let div = document.createElement("DIV");
    div.setAttribute("class" , "bg-white p-10 rounded-lg shadow-md mb-4 m-4 w-64 h-32");
    let h2 = document.createElement("H2");
    h2.setAttribute("class" , "text-xl font-semibold");
    h2.textContent = `${element._nombre} : ${element._hora}`
    div.appendChild(h2);
    fragment.appendChild(div);
});
containerrezos.appendChild(fragment); 
}
let imprimirfechagregoriana = ()=>{
  setInterval(Gregoriano, 600000);
  dates.textContent = Gregoriano(); 
}

document.addEventListener("DOMContentLoaded" , function (params) {
  imprimirfechagregoriana(); 
  getfechahijri();
  // Llama a la función getplace para iniciar el proceso
getplace();
// Llamar a coordenadas y luego a getplace
coordenadas(getplace);
coordenadas(getrezos);
setInterval(imprimirrezo, 60000);
imprimirfechahijri();
imprimirrezo();
imprimirezos(); 
setInterval(imprimirezos, 6000);

});