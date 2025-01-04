let date = document.getElementById("date");
let islamicdate = document.getElementById("islamicdate");
let location = document.getElementById("location");
let nextpray = document.getElementById("nextpray");


let diag = null;
let mesg = null;
let añog = null;

function updateDate() {
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
updateDate();
setInterval(updateDate, 600000);

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





let Apykey = "52921db3bff7be8d0af7a1e4ef64c7cd";
let lat = null;
let lon = null;

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

const getplace = async () => {
  let ubicaciondata = await peticionApipositionstack();
  imprimirUbicacion(ubicaciondata);
};

let imprimirUbicacion = (ubi) => {
  let pais = ubi.data[0].country ;
  let region = ubi.data[0].administrative_area ;
   let ciudad = ubi.data[0].region ;

  location.textContent = ` ${pais} / ${ciudad} / ${region}`;
};

// Llamar a coordenadas y luego a getplace
coordenadas(getplace);
