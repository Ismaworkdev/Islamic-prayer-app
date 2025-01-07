let brujula = document.getElementById("brujula");

    // Coordenadas de la Qibla (Meca)
    const latmecca = 21.4225;
    const lonmecca = 39.8262;
    // Coordenadas actuales 
    let  lat = null;
    let lon = null;
let posicionactual = ()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            if (lat !== null && lon !==null) {
              let dirr =   dirrecioncorrecta(lat , lon);
              brujula.style.transform = `rotate(${dirr}deg)`;
            }
        })
    }
}
posicionactual();
let dirrecioncorrecta = (lat, lon) => {
    console.log(lat, lon);
//formula 
//difencia de longuitud 
//deltalon = longuitudmecca - longuitudactual
//y = sin(diferencialonguitud) * cos(latitudmecca)
//x = cos(latitudactual) * sin(latitudmecca) - sin(latitudmecca) * cos(latitudmecca) * cos(diferencialonguitud)
//dirrecion = atan2(y, x) calcula el angulod de un punto plano 


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
