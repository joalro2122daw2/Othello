let fs = require('fs');
//let assert = require('assert'); //utilitzem assercions

//var XMLHttpRequest = require('xhr2');
const querystring = require('querystring');
const Jugador = require('./Jugador');
const Partida = require('./Partida');
const DAOMongo = require('./DAOMongo');

var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';

/* Envia el formulari del Login */
function login(response,datapost,request){  
  fs.readFile('./Othello_Login.html',function(err,sortida){
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
  });
    console.log("Enviat login" );
    response.write(sortida);
    response.end();
  });
}

/* Envia el css del html del tauler */
function enviarCSS(response,datapost,request)
{
  fs.readFile('./estil.css', function (err, sortida) {
    response.writeHead(200, {
        "Content-Type": "text/css"
    });
    console.log("Enviat css");
    response.write(sortida);
    response.end();
});
}

/* Envia el javascript del tauler */
function enviarSCRIPT(response,datapost,request)
{
    fs.readFile('./Othello_front.js', function (err, sortida) {
      response.writeHead(200, {
          "Content-Type": "text/javascript"
      });
      console.log("Enviat script");
      response.write(sortida);
      response.end();
  });
}

/* Afegeix l'usuari i la contrasenya a la base de dades i si es 
   el segon jugador, envia el tauler i inicia el joc */
   function validarUser(response,datapost,request){
    console.log("manegador de la petició 'validarUser' s'ha cridat.");
  
    // Obtenir el nom del usuari introduit
    let searchparams = new URLSearchParams(datapost);
    let nomusuari = searchparams.get("nombreusu");
    let idpartida = searchparams.get("idpartida");
    //console.log("Nom usuari: " + nomusuari + " id partida: " + idpartida);
    //console.log("Nom: " + searchparams.get("nombreusu"));
    
    if(!nomusuari || nomusuari.length == 0)
    {
      console.log("Nom no introuït.");
      response.write("Nom d'usuari no introduït");
      response.end();
      return;
    }
  
    if(idpartida === "null") // No existeix una partida amb un sol jugador. Crear nova partida i afegir-la
    {
      /* Crear nou objecte jugador amb fitxes blanques*/
      let j = new Jugador(nomusuari,"b");
      console.log("Partida null. Crear nova partida.");
      /* Crear una nova partida */
      let p = new Partida();
      p.jugadors.push(j);
      DAOMongo.afegeixPartida(p);
      idpartida = p._id;
    }
    else // La partida amb un sol jugador existeix, afegir el jugador a la partida existent
    {
      /* Crear nou objecte jugador amb fitxes negres*/
      let j = new Jugador(nomusuari,"n");
      console.log("Existeix partida amb un jugador" + idpartida + " Afegir jugador " + nomusuari);
      DAOMongo.afegirJugador(j,idpartida);
    }
    /* Enviar cookie de sessio */
    let cookie = "Nom="+nomusuari+" Id="+idpartida;
    //console.log("id: " + cookie);
    response.writeHead(200, {'Set-Cookie': cookie, 'Content-Type': 'text/plain'});
    response.end();
  }

/* Envia el html del tauler */
function enviarTauler(response,datapost,request) {
  fs.readFile('./Othello.html', function (err, sortida) {
    response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });
    console.log("Enviat html" );
    response.write(sortida);
    response.end();
  });
}

/* Envia la imatge de la fitxa negra */
function enviarFitxaNegra(response,datapost,request)
{
    fs.readFile('./imatges/fitxa-negra.png', function (err, sortida) {
      response.writeHead(200, {
          "Content-Type": "image/png"
      });
      console.log("Enviada imatge fitxa negra");
      response.write(sortida);
      response.end();
  });
}

/* Envia la imatge de la fitxa blanca */
function enviarFitxaBlanca(response,datapost,request)
{
    fs.readFile('./imatges/fitxa-blanca.png', function (err, sortida) {
      response.writeHead(200, {
          "Content-Type": "image/png"
      });
      console.log("Enviada imatge fitxa blanca");
      response.write(sortida);
      response.end();
  });
}

/* Commproba si existeix un partida amb un sol jugador.
   Si existeix, envia les dades al client per a que aquest envii el seu nom i el id de la partida de
   tornada al servidor i aquest la actualitzará i començara la partida.
   Si no existeix, envia un zero al client per a que aquest envii el seu nom i el servidor creara una
   nova partida amb aquest jugador i la afegira a la base de dades. */
   function comprobarPartidaDisponible(response,datapost,request){
    console.log("manegador de la petició 'comprobarPartidaDisponible' s'ha cridat.");
    DAOMongo.partidaUnJugador(response);
   }
  
/* Envia en format JSON la partida amb l'id que s'extreu de la cookie del client */
function consultaEstat(response,datapost,request)
{
  //Obtenir la cookie del client amb el nom del jugador i l'id de la partida
  const cookieHeader = request.headers?.cookie;
  let indexnom = cookieHeader.indexOf('=')+1;
  let indexid = cookieHeader.lastIndexOf('=')+1;
  let nom = cookieHeader.substr(indexnom,(indexid-4-indexnom));
  let id = cookieHeader.substr(indexid);
  DAOMongo.consultaEstado(nom,id,response);
  //console.log("Cookie Nom: " + nom + " Id: " + id);
}

/* Extreu de la cookie del client, l'id de la partida. Obté la fila , la columna del tauler i el color de
   la fitxa passades com a arguments del put. Modifica el contingut d'aquesta casella al tauler de la partida
   en la base de dades. Crida al metode calcularRepercursions per a refer el tauler de la partida segons les 
   consequencies de afegir la nova fitxa. */
function fitxaPosada(response,datapost,request)
{
  console.log("manegador de la petició 'fitxaPosada' s'ha cridat.");  
 //Obtenir la cookie del client amb l'id de la partida
  const cookieHeader = request.headers?.cookie;
  let indexid = cookieHeader.lastIndexOf('=')
  let id = cookieHeader.substr(indexid);
  // Obtenir la fila, columna i color de la fitxa
  let searchparams = new URLSearchParams(datapost);
  let fila = searchparams.get("fila");
  let columna = searchparams.get("columna");
  let color = searchparams.get("color");
  console.log("Fila:" + fila + " Columna: " + columna + " Color: " + color);
  //FALTA ESCRIBIR METODO EN DAOMongo PARA MODIFICAR LA CASILLA CON LA FICHA Y LLAMAR A calcularRepercusions
  response.end();
}

function calcularRepercusions()
{
  //FALTA ESCRIBIR
}

  exports.login = login;
  exports.enviarCSS = enviarCSS;
  exports.enviarSCRIPT = enviarSCRIPT;
  exports.validarUser = validarUser;
  exports.enviarTauler = enviarTauler;
  exports.enviarFitxaNegra = enviarFitxaNegra;
  exports.enviarFitxaBlanca = enviarFitxaBlanca;
  exports.comprobarPartidaDisponible = comprobarPartidaDisponible;
  exports.consultaEstat = consultaEstat;
  exports.fitxaPosada = fitxaPosada;

  