let fs = require('fs');
let assert = require('assert'); //utilitzem assercions

var XMLHttpRequest = require('xhr2');
const querystring = require('querystring');

var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';


/* Afegeix l'usuari i la contrasenya a la base de dades i si es 
   el segon jugador, envia el tauler i inicia el joc */
function validarUser(response,datapost){
  console.log("manegador de la petició 'validarUser' s'ha cridat.");
  response.writeHead(204); // Sense resposta
  // Obtenir el nom del usuari introduit
  let searchparams = new URLSearchParams(datapost);
  let nomusuari = searchparams.get("nombreusu");
  //console.log("Nom: " + searchparams.get("nombreusu"));
  if(!nomusuari || nomusuari.length == 0)
  {
    console.log("Nom no introuït.");
    response.write("Nom d'usuari no introduït");
    response.end();
    return;
  }
  /*FALTA:
    - CONSTRUIR UN OBJETO JUGADOR
    - COMPROBAR EN LA BASE DE DATOS DE MONGO partides SI EXISTE UNA PARTIDA CON UN SOLO JUGADOR
    - SI NO EXISTE UNA PARTIDA CON UN SOLO JUGADOR, CREAR UN OBJETO PARTIDA Y AÑADIR EL OBJETO JUGADOR
    - SI EXISTE UNA PARTIDA CON UN SOLO JUGADOR, AÑADIR EL OBJETO JUGADOR E INICIAR LA PARTIDA
  */
  
  MongoClient.connect(cadenaConnexio,function(err,client){
    assert.equal(null, err);
    console.log("Connexió correcta");
    var db = client.db('partides');
    db.collection('partides').insertOne({
        "nom": searchparams.get('nombreusu')
    });
    assert.equal(err, null);
    console.log("Afegit document a col·lecció partides");
  });
  //  FALTA AÑADIR LOS DATOS A LA BASE DE DATOS. LUEGO HACER UNA QUERY Y SI HAY DOS JUGADORES
  //  ENVIAR EL TABLERO Y COMENZAR LA PARTIDA. CUANDO UN JUGADOR SALE DE LA PARTIDA, SE BORRA DE 
  //  LA BASE DE DATOS.
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
  exports.validarUser = validarUser;
  exports.enviarTauler = enviarTauler;
  exports.enviarCSS = enviarCSS;
  exports.enviarSCRIPT = enviarSCRIPT;
  exports.enviarFitxaNegra = enviarFitxaNegra;
  exports.enviarFitxaBlanca = enviarFitxaBlanca;