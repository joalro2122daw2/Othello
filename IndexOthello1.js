var server = require("./OthelloServer2");
var encaminador = require("./encaminador3");
var manegadorPeticions = require("./OthelloFunctions4");
var manegadors = {};


/* Afegir  propietats amb clau: crida y valor:funcio al objecte javascript manegadors */ 
manegadors["/"] = manegadorPeticions.login; // Envia un formulario de login al cliente
manegadors["/comprobarPartidaDisponible"] = manegadorPeticions.comprobarPartidaDisponible;

manegadors["/validarUser"] = manegadorPeticions.validarUser; // 
manegadors["/tauler"] = manegadorPeticions.enviarTauler;

manegadors["/estil.css"] = manegadorPeticions.enviarCSS;
manegadors["/Othello_front.js"] = manegadorPeticions.enviarSCRIPT;
manegadors["/imatges/fitxa-negra.png"] = manegadorPeticions.enviarFitxaNegra;
manegadors["/imatges/fitxa-blanca.png"] = manegadorPeticions.enviarFitxaBlanca;

// Iniciar el servidor 
server.iniciar(encaminador.encaminar, manegadors);

