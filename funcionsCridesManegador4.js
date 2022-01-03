let fs = require('fs');
var XMLHttpRequest = require('xhr2');

/* Envia el html del tauler */
function enviarTauler(response) {
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
function enviarCSS(response)
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
function enviarSCRIPT(response)
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
function enviarFitxaNegra(response)
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
function enviarFitxaBlanca(response)
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


  /*
  let ajax = new XMLHttpRequest();
  let texto;
  if (ajax.readyState==4 && xhttp.status==200) {
    return ajax.response;
    } 
  ajax.open("GET","http://localhost:80/Othello.html",true);
  //ajax.onreadystatechange = texto;
  ajax.send();
  */

    /*
    console.log("manegador de la petició 'iniciarOthello' s'ha cridat.");
    return "<!DOCTYPE html>"+
               "<html lang='en'>"+
               "<head>"+
                  "<meta charset='UTF-8'>"+
                  "<meta http-equiv='X-UA-Compatible' content='IE=edge'>"+
                  "<meta name='iewport' content='width=device-width, initial-scale=1.0'>"+
                  "<title>Document</title>"+                  
                  "<script>"+
                      "var tauler;"+
                      "var color = 'n';"+
                      "function iniciar(){"+
                          "tauler = document.getElementById('tauler');"+
                          "tauler.addEventListener('click',pintarFitxa);}"+                  

                      "function pintarFitxa(ev){"+
                      "if(color == 'b'){"+
                      "let fitxa = new Image(96,96);"+
                      "fitxa.src = './imatges/fitxa-blanca.png';"+ 
                      "ev.target.appendChild(fitxa);}"+
                      "else{"+
                      "let fitxa = new Image(96,96);"+
                      "fitxa.src = './imatges/fitxa-negra.png';"+
                      "ev.target.appendChild(fitxa);}}"+
                  "</script>"+
                  "<style>"+
                      "tr > *{border:2px black solid; width:100px; height:100px;}"+
                  "</style>"+
               "</head>"+               
               "<body onload='iniciar()'>"+               
                  "<div id='divtauler'>"+
                    "<table id='tauler' style='width:500; height:500;'>"+
                        "<tr> <td id='f1c1'></td> <td id='f1c2'></td> <td id='f1c3'></td><td id='f1c4'></td> <td id='f1c5'></td> <td id='f1c6'></td> <td id='f1c7'></td> <td id='f1c8'></td> </tr>"+
                        "<tr> <td id='f2c1'></td> <td id='f2c2'></td> <td id='f2c3'></td> <td id='f2c4'></td> <td id='f2c5'></td> <td id='f2c6'></td> <td id='f2c7'></td> <td id='f2c8'></td> </tr>"+
                        "<tr> <td id='f3c1'></td> <td id='f3c2'></td> <td id='f3c3'></td> <td id='f3c4'></td> <td id='f3c5'></td> <td id='f3c6'></td> <td id='f3c7'></td> <td id='f3c8'></td> </tr>"+
                        "<tr> <td id='f4c1'></td> <td id='f4c2'></td> <td id='f4c3'></td> <td id='f4c4'></td> <td id='f4c5'></td> <td id='f4c6'></td> <td id='f4c7'></td> <td id='f4c8'></td> </tr>"+
                        "<tr> <td id='f5c1'></td> <td id='f5c2'></td> <td id='f5c3'></td> <td id='f5c4'></td> <td id='f5c5'></td> <td id='f5c6'></td> <td id='f5c7'></td> <td id='f5c8'></td> </tr>"+
                        "<tr> <td id='f6c1'></td> <td id='f6c2'></td> <td id='f6c3'></td> <td id='f6c4'></td> <td id='f6c5'></td> <td id='f6c6'></td> <td id='f6c7'></td> <td id='f6c8'></td> </tr>"+
                        "<tr> <td id='f7c1'></td> <td id='f7c2'></td> <td id='f7c3'></td> <td id='f7c4'></td> <td id='f7c5'></td> <td id='f7c6'></td> <td id='f7c7'></td> <td id='f7c8'></td> </tr>"+
                        "<tr> <td id='f8c1'></td> <td id='f8c2'></td> <td id='f8c3'></td> <td id='f8c4'></td> <td id='f8c5'></td> <td id='f8c6'></td> <td id='f8c7'></td> <td id='f8c8'></td> </tr>"+
                    "</table>"+
                "</div>"+              
              "</body>"+              
          "</html>";  
          */
           
  
  
  function pujar() {
    console.log("manegador de la petició 'pujar' s'ha cridat.");
    return "Hola pujar";
  }
  
  exports.enviarTauler = enviarTauler;
  exports.enviarCSS = enviarCSS;
  exports.enviarSCRIPT = enviarSCRIPT;
  exports.enviarFitxaNegra = enviarFitxaNegra;
  exports.enviarFitxaBlanca = enviarFitxaBlanca;