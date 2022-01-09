//const { enviarTauler } = require("./OthelloFunctions4");

var tauler;
var color = 'n';
var ample;
var alt;


function iniciar()
{
    /*
    tauler = document.getElementById("tauler");
    tauler.addEventListener("click",pintarFitxa);
    */
    alt = window.screen.availHeight;
    ample = window.screen.availWidth;
    /*
    console.log(ample);
    tauler.style.width = (ample/2).toString() + "px";
    tauler.style.height = (alt/2).toString() + "px";
    */
}
/*
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
*/
/* Envia al servidor la peticio de comprobar si existeix una partida amb un sol jugador.
   Si existeix, s'envia el nom del jugador amb el id de la partida enviada pel servidor.
   Si no existeix se envia el nom del jugador */
function partidaUnJugador()
{
    let xhttp = new XMLHttpRequest();
    let func = function(){
    if (xhttp.readyState==4 && xhttp.status==200) {
        let nomusu = document.getElementById("nombreusu").value; 
        if(xhttp.responseText === "0") // No existeix partida amb un sol jugador
            //console.log(nomusu);
            afegirPartida(nomusu,null);
        else// Existeix una partida amb un sol jugador
        {
            let idpartida = JSON.parse(xhttp.response)._id;
            //console.log(JSON.parse(xhttp.response)._id);
            afegirPartida(nomusu,idpartida);
        }
      } 
    }
    xhttp.open("GET", "http://localhost:8888/comprobarPartidaDisponible", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send();
}


/* Envia al servidor el nom del jugador pasat com a primer argument i l'id de la partida passat com
   a segon. Si el segon parametre no es null, el servidor ficará el nom del jugador en l'array de jugadors
   de la partida i l'iniciara. Si el primer parametre es null, el servidor construira una nou objecte jugador
   i partida i la ficara a la base de dades. */

function afegirPartida(nomjugador,idpartida)
{
    //let nomusu = document.getElementById("nombreusu").value;
    let params = "nombreusu="+nomjugador+"&idpartida="+idpartida
    let xhttp = new XMLHttpRequest();
    let func = function(){
    if (xhttp.readyState==4 && xhttp.status==200) {
        //console.log("Resposta afegeix partida: " + xhttp.responseText);
        demanarTauler();
        } 
    }
    xhttp.open("POST", "http://localhost:8888/validarUser", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send(params);
}


function demanarTauler()
{
    let xhttp = new XMLHttpRequest();  
    let func = function(){
        //console.log("Tauler rebut");        
        let divlogin = document.getElementById("divLogin");
        divlogin.hidden = true;
        let retol = document.getElementById("Retol");
        retol.innerHTML = "Partida d'Othello"
        let div = document.getElementById("divTauler");
        div.innerHTML = xhttp.response;
        tauler = document.getElementById("tauler");
        if(tauler)
            tauler.addEventListener("click",pintarFitxa);
        alt = window.screen.availHeight;
        ample = window.screen.availWidth;
        //console.log(ample);
        //tauler.style.width = (ample/2.5).toString() + "px";
        //tauler.style.height = (alt/2.5).toString() + "px";
        setInterval(consultaEstat,10000);
    } 
    xhttp.open("GET", "http://localhost:8888/tauler", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send();
}

function consultaEstat()
{
    let xhttp = new XMLHttpRequest();
    let func = function(){
        let complet = getComplerta(xhttp.response);
        let tauler = getTauler(xhttp.response);
        let lbCom = document.getElementById("lbCom");
        pintaTauler(tauler);
        console.log("Tauler " + tauler);
        if(complet === 'false')
        {
            lbCom.innerHTML = "Esperant rival";
            lbCom.style.backgroundColor = "yellow";
        }

    }
    xhttp.open("GET", "http://localhost:8888/consultaEstat", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send();
}

//{"_id":"nip444jfswnzgfo1d1tlb","complerta":false,"jugadors":[{"nom":"Jose Antonio","fitxes":2,"color":"b"}],"tauler":[[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,1,0,-1,-1],[-1,-1,-1,-1,0,1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1]]}

/* Obté el camp complerta de la resposta rebuda corresponent al estat de la partida en curs */
function getComplerta(resposta)
{
    let inici = resposta.indexOf("complerta")+10;
    let fi = resposta.indexOf("jugadors");
    return(resposta.substr(inici+1,fi-inici-3));
}
/* Obté el camp tauler de la resposta rebuda corresponent al estat de la partida en curs */
function getTauler(resposta)
{
    let inici = resposta.indexOf("tauler")+7;
    return(resposta.substr(inici+1,resposta.length-inici-2));
}
function pintaTauler(tauler)
{    
    let ind1 = tauler.indexOf(',');
    let ind2 = tauler.indexOf(',',ind1+1);
    let i = 1;
    let j = 1;
    while(ind1 > 0 && ind2 > 0)
    {
        let c = tauler.substr(ind1+1,ind2-ind1-1);
        if(c[0] === '[')
          c = c.substr(1);
        else if(c[c.length-1] === ']')
          c = c.substr(0,c.length-1);
        if(j < 8)
            j++;
        else
        {
            j = 1;
            i++;
        }
        console.log("Casella:" + i.toString()+j.toString() + " C: " + c);
        ind1 = ind2;
        if(ind1 > 0)
            ind2 = tauler.indexOf(',',ind1+1);
        pintarFitxa(i,j,c);
    }
}

function pintarFitxa(i,j,c)
{
    if(c === '-1')
        return;
    let fitxa;
    if(c === '1')
    {        
        fitxa = new Image(ample/20,alt/12);
        fitxa.src = 'imatges/fitxa-blanca.png'; 
    }
    else
    {
        fitxa = new Image(ample/20,alt/12);
        fitxa.src = 'imatges/fitxa-negra.png'; 
    }   
    let nomcasella = i.toString()+j.toString();
    console.log("Nom casella: " + nomcasella);
    let casella = document.getElementById(nomcasella);
    if(casella.children.length > 0)
        casella.removeChild(casella.firstChild);
    casella.appendChild(fitxa);
}
