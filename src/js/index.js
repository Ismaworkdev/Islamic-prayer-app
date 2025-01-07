let date = document.getElementById("date");
let islamicdate = document.getElementById("islamicdate");
let location = document.getElementById("location");
let nextpray = document.getElementById("nextpray")
let containerrezos = document.getElementById("containerrezos");
import { rezo } from "./rezos.js";

let Apykey = "f2cfd0317072441bfd71c2f9e0ff119b";
 let lat = null;
 let lon = null;

let rezosdeldia =[];
let diag = null;
let mesg = null;
let añog = null;

function Gregoriano() {
  let dateactual = new Date();
  let dia = dateactual.getDate();
  let mes = dateactual.getMonth() + 1; 
  let año = dateactual.getFullYear();
  date.innerHTML = ` ${dia} / ${mes} / ${año}`;
  diag = dia;
  mesg = mes;
  añog = año;
}
// Actualizar cada 10 minutos
Gregoriano();
setInterval(Gregoriano, 600000);

const peticionApihijricalendario = () =>{
    return fetch (`http://api.aladhan.com/v1/gToH/${diag}-${mesg}-${añog}`)
    .then((response) => response.json())
    .then((json) => json);
};

const getfechahijri = async ()=>{
let fechahijri = await peticionApihijricalendario();
imprimirfechahijri(fechahijri);
};
getfechahijri();

let imprimirfechahijri = (fechahijri) => {
let año = fechahijri.data.hijri.year; 
let dia = fechahijri.data.hijri.day; 
let mes = fechahijri.data.hijri.month.number ; 
islamicdate.textContent = ` ${dia} / ${mes} / ${año}`
}





let coordenadas = (callback) => {
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

const peticionApipositionstack = () => {
  return fetch(`http://api.positionstack.com/v1/reverse?access_key=${Apykey}&query=${lat},${lon}`)
    .then((response) => response.json())
    .then((json) => json);
};
let ubicacion = null;

const getplace = async () => {
  ubicacion = JSON.parse(localStorage.getItem('ubi'));
  if (ubicacion == null) {
    let ubicaciondata = await peticionApipositionstack();
    imprimirUbicacion(ubicaciondata);
  } else {
    imprimirUbicacion();
  }
};

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

// Llama a la función getplace para iniciar el proceso
getplace();


// Llamar a coordenadas y luego a getplace
coordenadas(getplace);







//rezos
const peticionApirezos = () =>{
  
  return fetch(`http://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`)  
  .then((response) => response.json())
  .then((json) => json);

}

const getrezos = async () => {
  let rezosdata = await peticionApirezos();
 
  rezosdehoy(rezosdata.data.timings); 
};
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
coordenadas(getrezos);

let siguienterezo = () => {
  let rezoshoy = JSON.parse(localStorage.getItem('rezosdeldia'));
  let horaActual = horaactual();

  for (let i = 0; i < rezoshoy.length; i++) {
    if (horaActual < rezoshoy[i]._hora) {
      return rezoshoy[i];
    }
  }

  // Si la hora actual es después del último rezo del día, devolver el primer rezo del día siguiente
  return rezoshoy[0];
};

let horaactual = () => {
  let date = new Date();
  let horas = date.getHours();
  let minutos = date.getMinutes();
  let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  return horaFormateada;
};

// Ejemplo de uso
console.log(siguienterezo());


let imprimirrezo = ()=>{
  let rezo = siguienterezo();
  nextpray.textContent = `${rezo._nombre} a las ${rezo._hora}`; 
}
imprimirrezo();
setInterval(imprimirrezo, 60000);





let rezosdeldialocalsotaje = JSON.parse(localStorage.getItem('rezosdeldia'));



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
imprimirezos(); 
setInterval(imprimirezos, 6000);