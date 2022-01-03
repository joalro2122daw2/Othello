var tauler;
var color = 'n';
var ample;
var alt;


function iniciar()
{
    tauler = document.getElementById("tauler");
    tauler.addEventListener("click",pintarFitxa);
    alt = window.screen.availHeight;
    ample = window.screen.availWidth;
    console.log(ample);
    tauler.style.width = (ample/2).toString() + "px";
    tauler.style.height = (alt/2).toString() + "px";
}

function pintarFitxa(ev)
{
    if(color == 'b')
    {
        console.log(ev.target.id);
        let fitxa = new Image(ample/20,alt/12);
        fitxa.src = 'imatges/fitxa-blanca.png'; 
        ev.target.appendChild(fitxa);

        //ev.target.appendChild(fitxablanca);
    }
    else
    {
        let fitxa = new Image(ample/20,alt/12);
        fitxa.src = 'imatges/fitxa-negra.png'; 
        ev.target.appendChild(fitxa);
        
        //ev.target.appendChild(fitxanegra);        
    }    
}

