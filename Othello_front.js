var tauler;
var color = 'n';
var ample;
var alt;
var partida;
var id;
var ip = "192.168.1.41";

/* Obté les mides de la pantalla */
function iniciar()
{
    alt = window.screen.availHeight;
    ample = window.screen.availWidth;
}

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
            afegirPartida(nomusu,null);
        else// Existeix una partida amb un sol jugador
        {
            let idpartida = JSON.parse(xhttp.response)._id;            
            afegirPartida(nomusu,idpartida);
        }
      } 
    }
    xhttp.open("GET", "http://"+ip+":8888/comprobarPartidaDisponible", true);
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
    // Establir el color del jugador */
    if(idpartida)
        color = 'n';
    else
        color = 'b';
    //Preparar els parametres que s'enviaran al servidor
    let params = "nombreusu="+nomjugador+"&idpartida="+idpartida
    let xhttp = new XMLHttpRequest();
    let func = function(){
    if (xhttp.readyState==4 && xhttp.status==200) {
        //console.log("Resposta afegeix partida: " + xhttp.responseText);
        demanarTauler();
        } 
    }
    xhttp.open("POST", "http://"+ip+":8888/validarUser", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send(params);
}

/* Fa la petició de tauler al servidor, el mostra i comença el cicle de peticions
   de estat de la partida */
function demanarTauler()
{
    let xhttp = new XMLHttpRequest();  
    let func = function(){
        if (xhttp.readyState==4 && xhttp.status==200) {
        //console.log("Tauler rebut");        
        let divlogin = document.getElementById("divLogin");
        divlogin.hidden = true;
        let retol = document.getElementById("Retol");
        retol.innerHTML = "Partida d'Othello"
        let div = document.getElementById("divTauler");
        div.innerHTML = xhttp.response;
        tauler = document.getElementById("tauler");
        if(tauler)
            tauler.addEventListener("click",posarFixta);
        alt = window.screen.availHeight;
        ample = window.screen.availWidth;        
        id = setInterval(consultaEstat,1000);
        }
    } 
    xhttp.open("GET", "http://"+ip+":8888/tauler", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send();
}

/* Demana l'estat de la partida al servidor i pren accions en consequencia */
function consultaEstat()
{
    let xhttp = new XMLHttpRequest();

    let func = function(){
        if (xhttp.readyState==4 && xhttp.status==200) {
            let complet;
            let tauler;
            let lbCom = document.getElementById("lbCom");
            try
            {
                partida = JSON.parse(xhttp.responseText);
            }
            catch{}
            
            if(partida)
            {            
                complet = partida.complerta;                
            }
            else
            {          
              complet = getComplerta(xhttp.responseText);            
            } 

            if(complet === 'false' || !complet)
            {
                lbCom.innerHTML = "Esperant rival";
                lbCom.style.backgroundColor = "yellow";
                lbCom.style.color = "black";
                return;
            }
            else if(complet)
            {    
                let torn = (partida.torn === 'b')?0:1;
                if(torn != 0 && torn != 1)//error d'conexio
                    return; 
                let nomjugador = partida.jugadors[torn].nom;
                lbCom.innerHTML = "Torn pel jugador: "+nomjugador + " amb: " + ((partida.torn === 'b')?'blanques':'negres');
                lbCom.style.backgroundColor = "green";
                lbCom.style.color = 'chartreuse';                
                let fitxesb = partida.jugadors[0].fitxes;
                let fitxesn = partida.jugadors[1].fitxes;                
                if(fitxesb + fitxesn < 64)
                {
                   document.getElementById("lbPunts").innerHTML = "Punts: <br> Blanques: " + fitxesb + "<br> Negres: " + fitxesn;
                }
                else
                { 
                    lbCom.innerHTML = "Fi de la partida";
                    clearInterval(id);
                    document.getElementById("lbPunts").innerHTML = "Guanyen les fitxes: " + ((fitxesb > fitxesn)?"blanques":"negres");
                }
            }
            else
            {
                lbCom.innerHTML = "Sense conexió";
                lbCom.style.backgroundColor = "red";
                lbCom.style.color = "black";
            }
            tauler = getTauler(xhttp.response);
            pintaTauler(tauler);            
        }
    }
    xhttp.open("GET", "http://"+ip+":8888/consultaEstat", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate");
    xhttp.setRequestHeader("Content-type","text/html");
    xhttp.onreadystatechange=func;
    xhttp.send();
}

/* Obté el camp complerta de la resposta rebuda corresponent al estat de la partida en curs */
function getComplerta(resposta)
{
    let inici = resposta.indexOf("complerta")+10;
    let fi = resposta.indexOf("torn");
    return(resposta.substr(inici+1,fi-inici-3));
}
/* Obté el camp tauler de la resposta rebuda corresponent al estat de la partida en curs */
function getTauler(resposta)
{
    let inici = resposta.indexOf("tauler")+7;
    return(resposta.substr(inici+1,resposta.length-inici-2));
}
/* Obté el camp torn de la resposta rebuda corresponent al estat de la partida en curs */
function getTorn(resposta)
{
    let inici = resposta.indexOf("torn")+7;
    return(resposta.substr(inici+1,1));
}
/* Repinta el tauler segons el seu estat pasat com a argument */
function pintaTauler(tauler)
{    
    try
    {
        let taulerarray = JSON.parse(tauler);
        for(let i = 0; i < 8; i++)
        {
            for(let j = 0; j < 8; j++)
            {                
                pintarFitxa(i+1,j+1,taulerarray[i][j]);
            }
        }
    }
    catch
    {

    }
}
/* Pinta a la casella de fila i i columna j, la fitxa de color c */
function pintarFitxa(i,j,c)
{
    if(c < 0)
        return;
    let fitxa;
    if(c > 0)
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
    let casella = document.getElementById(nomcasella);
    if(casella.children.length > 0)
        casella.removeChild(casella.firstChild);
    casella.appendChild(fitxa);
}


/* Fa comprovacions i si tot es correcte, dibuixa la fitxa a la casella on el
   jugador a fet click i crida a enviarFitxa per a desar-la al servidor */
function posarFixta(ev)
{
    if(!partida ) // Si la partida no ha començat, o ja s'ha posat una fitxa, no fer res
        return;
    if(partida.torn === color) //Si el torn es del jugador que ha clicat
    {
        console.log("Fitxa posada");
        let i = ((ev.target.id).substr(0,1)*1)-1;
        let j = ((ev.target.id).substr(1)*1)-1;
        //Comprovar si la casella està buida
        try
        {
         console.log(partida.tauler[i][j]);
        }
        catch(error)
        {
            console.log("Casella ocupada");
            return;
        }
        if(color == 'b')
        {
            console.log(ev.target.id);
            let fitxa = new Image(ample/20,alt/12);
            fitxa.src = 'imatges/fitxa-blanca.png'; 
            ev.target.appendChild(fitxa);
            enviarFitxa(i,j,1);
        }
        else
        {
            let fitxa = new Image(ample/20,alt/12);
            fitxa.src = 'imatges/fitxa-negra.png'; 
            ev.target.appendChild(fitxa);
            enviarFitxa(i,j,0);
        }      
    }   
}

/* Envia al servidor una fitxa per que la afegeixi */
function enviarFitxa(i,j,color)
{
    let xhttp = new XMLHttpRequest();  
    let params = "fila="+i+"&columna="+j+"&color="+color;
    let func = function(){
        if (xhttp.readyState==4 && xhttp.status==200) {
        //Una vegada afegida la fitxa, demanar al servidor que calculi les repercusions, modifiqui el
        // tauler i canvii de jugador
        console.log("Demanar repercusions");
        demanarRepercusions();
        } 
    }
    xhttp.open("PUT", "http://"+ip+":8888/fitxaPosada", true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send(params);
}


/* Demana al servidor que calculi les repercusions, modifiqui el tauler en consequencia i
    canvii de jugador */
function demanarRepercusions()
{
    let xhttp = new XMLHttpRequest();
    let func = function(){
        if (xhttp.readyState==4 && xhttp.status==200) {
        /* Accions a realitzar una vegada actualitzat el tauler i el torn */
        habilitat = true;
        let lbCom = document.getElementById("lbCom");
        let torn = (partida.torn === 'b')?0:1;
        let nomjugador = partida.jugadors[torn].nom;
        lbCom.innerHTML = "Torn pel jugador: "+nomjugador;
        partida = JSON.parse(xhttp.responseText);
        }
    }
    xhttp.open("GET","http://"+ip+":8888/calculaRepercusions",true);
    xhttp.setRequestHeader("Cache-Control","no-cache, mustrevalidate")
    xhttp.onreadystatechange=func;
    xhttp.send();
}


function btSortir_clicked()
{
    let head = new Headers({"Content-Type":"text/plain"});
    let init = {"method":'DELETE',
                "headers":head,
                "mode":'cors',
                "cache":'default'
                }
    let request = new Request("http://"+ip+":8888/finalitzar",init);
    fetch(request).then((response) =>{
        if(response.ok)
        {
            response.text().then((resposta) =>{
                console.log("Resposta: " + resposta);
                let lbCom = document.getElementById("lbCom"); 
                lbCom.innerHTML = "Partida finalitzada";
                lbCom.style.backgroundColor = "yellow";
                lbCom.style.color = "black";
                console.log(resposta);
                clearInterval(id);
            })
        }
        else{
            console.log("Resposta no ng");
        }
    });
}