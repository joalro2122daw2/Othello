var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';
let assert = require('assert');
var resultado = [];

class DAOMongo{


        /* Cerca una partida amb un sol jugador, si existeix, envia les dades de la partida i si no, envia 0 */
        static partidaUnJugador(response)
        {
          MongoClient.connect(cadenaConnexio,function(err,client){
            var db = client.db('partides');
            db.collection('partides').aggregate([{$project:{count:{$size:"$jugadors"}}}]).toArray(function(err,result){                                  
              if(result[0])
              {
                console.log(result[0].count); 
                if(result[0].count === 1)
                  response.write(JSON.stringify(result[0]));
                else
                  response.write("0");                         
              }
              else
              {
                response.write("0");
              }
              response.end();    
            });
          });
        }

        /* Afegeix la partida pasada com a argument a la base de dades partides */
        static afegeixPartida(partida){
            MongoClient.connect(cadenaConnexio,function(err,client){
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('partides');
                let inserted = db.collection('partides').insertOne({"_id":partida._id, "complerta":partida.complerta, "jugadors":partida.jugadors,"tauler":partida.tauler});
                assert.equal(err, null);
                console.log("Afegit document a col·lecció partides");                          
        });
      }
      
      static obtenirJugadors(response)
      {    
            MongoClient.connect(cadenaConnexio,async function(err,client){
                var db = client.db('partides');                                              
                let promise = db.collection('partides').find({}).toArray((function(err,result){                    
                    result.forEach(x => console.log(x));
                    let resposta = "";
                    result.forEach(x => resposta += JSON.stringify(x));
                    response.write(resposta);
                    response.end();
                }))
                //console.log("Promise: " + Object.keys(promise));
                
            });
      }

      /* Obté la partida corresponent al id passat com a argument i la envia en format json */
      static consultaEstado(nom,id,response)
      {
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides');     
          let promise = db.collection('partides').find({_id:id},{complerta:1,tauler:1}).toArray((function(err,result){                    
            //result.forEach(x => console.log(x));
            if(result.length > 0)
            {
              //console.log(result[0].complerta);
              //console.log(result[0].tauler);
              response.write(JSON.stringify(result[0]));
            }
            response.end();                      
          }))
        });
      }

      



}//Fi de la classe




module.exports=DAOMongo;