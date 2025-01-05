
let containerrezos = document.getElementById("containerrezos");
let rezosdeldia = JSON.parse(localStorage.getItem('rezosdeldia'));

console.log(rezosdeldia);

let imprimirezos = ()=>{
    let fragment = document.createDocumentFragment();
    rezosdeldia.forEach(element => {
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

setInterval(imprimirezos(), 60);