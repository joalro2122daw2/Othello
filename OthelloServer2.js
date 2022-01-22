const { append } = require("express/lib/response");
var http = require("http");
var url = require("url");



/* Ejecuta una funcion determinada por el path que devuelve la funcion pasada como primer argumento
 (encaminar en encaminador3.js) la cual coincide con uno de los nombres de las propiedades del 
  objeto javascript pasado como segundo argumento ( manegadors en IndexEncaminat1.js ) */

  
function iniciar(encaminar, manegadorPeticions) {
  function onRequest(request, response) {
    
    const baseURL = request.protocol + '://' + request.headers.host + '/'; //Path de la url de la peticion (http://host/)
    const reqUrl = new URL(request.url, baseURL);
    var dataPosteada = "";
    //console.log("Petició per a  " + reqUrl.pathname + " rebuda.");

    request.addListener("data", function(trozoPosteado) {
			dataPosteada += trozoPosteado;
			//console.log("Recibido trozo POST '" + trozoPosteado + "'.");
		});

    request.addListener("end", function() {
			encaminar(manegadorPeticions, reqUrl.pathname, response, dataPosteada,request);
		});

    //encaminar(manegadorPeticions, reqUrl.pathname, response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Servidor Othello iniciat.");
}

exports.iniciar = iniciar;