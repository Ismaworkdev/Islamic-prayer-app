let brujula = document.getElementById("brujula");
let titulocalendario = document.getElementById("titulocalendario");
let lastday = document.getElementById("lastday");
//todo lo del index.js
import { diag
    , mesg,
     añog, 
     Gregoriano ,
     lat ,
      lon ,
       coordenadas ,
       getfechahijri
       , peticionApihijricalendario
     } from "./index.js";

    // Coordenadas de la Qibla (Meca)
    const latmecca = 21.4225;
    const lonmecca = 39.8262;
    // Coordenadas actuales 
 
  

let dirrecioncorrecta = (lat, lon) => {
    console.log(lat, lon);
//formula 
//difencia de longuitud 
//deltalon = longuitudmecca - longuitudactual
//y = sin(diferencialonguitud) * cos(latitudmecca)
//x = cos(latitudactual) * sin(latitudmecca) - sin(latitudmecca) * cos(latitudmecca) * cos(diferencialonguitud)
//dirrecion = atan2(y, x) calcula el angulo o la rotacion  de un punto plano 


// Convertir grados a radianes unidad de angulo
let  radianlat = (lat * Math.PI) / 180;
let  radianlon = (lon * Math.PI) / 180;
let  radianlatM = (latmecca * Math.PI) / 180;
let  radianlonM = (lonmecca * Math.PI) / 180;

// Calculo
let  deltalon = radianlonM - radianlon;
let  y = Math.sin(deltalon) * Math.cos(radianlatM);
let  x = Math.cos(radianlat) * Math.sin(radianlatM) - Math.sin(radianlat) * Math.cos(radianlatM) * Math.cos(deltalon);
let  qibla = (Math.atan2(y, x) * 180) / Math.PI;

// Ajustar el angulo en un  rango de 0 a 360 grados
let  dirr  = (qibla + 360) % 360;

return dirr;

};





//el dia islamico actual 
let dia = null; 
//imprimir el año islamico mes en arabe 
let datafechahijri = async () => {
    let fechahijri = await getfechahijri();


let año = fechahijri.data.hijri.year;
let mesenarabe = fechahijri.data.hijri.month.en;

let  diames  = fechahijri.data.hijri.month.number;
dia = fechahijri.data.hijri.day

titulocalendario.textContent = `${diames} - ${mesenarabe} - ${año}`; 
};
//imprimir el calendario hijri 
let imprimirdias= async ()=>{
    lastday.innerHTML = "";
    let fechahijri = await getfechahijri();
let diasdelmesactual = fechahijri.data.hijri.month.days
let fragment = document.createDocumentFragment();
for (let i = 1; i < diasdelmesactual; i++) {
    
   //si es el dia que se ponga en blanco si no es el dia que se normal 
    let div = document.createElement("DIV");
    if (i == dia ) {
        div.setAttribute("class" , "text-center font-bold bg-white rounded-2xl");
    }else{
        div.setAttribute("class" , "text-center");
    }
   //el numero como contenido 
    div.textContent = i;
    fragment.appendChild(div);
    
}
lastday.appendChild(fragment);

}


document.addEventListener("DOMContentLoaded" ,function () {
    Gregoriano(); 
    coordenadas(() => { 
        let dirr = dirrecioncorrecta(lat, lon);
         brujula.style.transform = `rotate(${dirr}deg)`; 
        });
    
    
    peticionApihijricalendario();
    datafechahijri();
    imprimirdias();
    setInterval(() => { 
        imprimirdias(); 
    }, 86400000); 
    //cada 24horas para cabiar de dias . 
})
