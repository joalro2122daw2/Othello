let fs = require('fs');
let assert = require('assert'); //utilitzem assercions

var XMLHttpRequest = require('xhr2');
const querystring = require('querystring');
const Jugador = require('./Jugador');
const Partida = require('./Partida');
const DAOMongo = require('./DAOMongo');

var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';

/* Commproba si existeix un partida amb un sol jugador.
   Si existeix, envia les dades al client per a que aquest envii el seu nom i el id de la partida de
   tornada al servidor i aquest la actualitzará i començara la partida.
   Si no existeix, envia un zero al client per a que aquest envii el seu nom i el servidor creara una
   nova partida amb aquest jugador i la afegira a la base de dades. */
   function comprobarPartidaDisponible(response,datapost){
    console.log("manegador de la petició 'comprobarPartidaDisponible' s'ha cridat.");
    DAOMongo.partidaUnJugador(response);
   }
  




/* Afegeix l'usuari i la contrasenya a la base de dades i si es 
   el segon jugador, envia el tauler i inicia el joc */
function validarUser(response,datapost){
  console.log("manegador de la petició 'validarUser' s'ha cridat.");
  //response.writeHead(204); // Sense resposta
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
  /* Crear nuevo objeto jugador */
  let j = new Jugador(nomusuari,"b");

  if(idpartida === "null") // No existeix una partida amb un sol jugador. Crear nova partida
  {
    console.log("Partida null. Crear nova partida.");
   /* Crear una nova partida */
   let p = new Partida();
   p.jugadors.push(j);
   DAOMongo.afegeixPartida(p);
  }
  else // La partida amb un sol jugador existeix, afegir el jugador 
  {
    console.log("Existeix partida amb un jugador" + idpartida + " Afegir jugador " + nomusuari);
  }
  /* Enviar cookie de sessio */
  response.writeHead(200, {'Set-Cookie': nomusuari, 'Content-Type': 'text/plain'});
  response.end();
}


/* Envia el formulari del Login */
function login(response,datapost){
  fs.readFile('./Othello_Login.html',function(err,sortida){
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
  });
    console.log("Enviat login" );
    response.write(sortida);
    response.end();
  });
}


/* Envia el html del tauler */
function enviarTauler(response,datapost) {
      fs.readFile('./Othello.html', function (err, sortida) {
        response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        console.log("Enviat html" );
        response.write(sortida);
        response.end();
    });
  }

  /* Envia el css del html del tauler */
function enviarCSS(response,datapost)
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
function enviarSCRIPT(response,datapost)
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

/* Envia la imatge de la fitxa negra */
function enviarFitxaNegra(response,datapost)
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
function enviarFitxaBlanca(response,datapost)
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
         
  
  exports.login = login;
  exports.comprobarPartidaDisponible = comprobarPartidaDisponible;



  exports.validarUser = validarUser;
  
  exports.enviarTauler = enviarTauler;
  exports.enviarCSS = enviarCSS;
  exports.enviarSCRIPT = enviarSCRIPT;
  exports.enviarFitxaNegra = enviarFitxaNegra;
  exports.enviarFitxaBlanca = enviarFitxaBlanca;