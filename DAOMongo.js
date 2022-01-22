var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';
let assert = require('assert');
const Partida = require('./Partida');


class DAOMongo{


        /* Cerca una partida amb un sol jugador, si existeix, envia les dades de la partida i si no, envia 0 */
        static partidaUnJugador(response)
        {
          MongoClient.connect(cadenaConnexio,function(err,client){
            var db = client.db('partides');
            db.collection('partides').aggregate([{$project:{count:{$size:"$jugadors"}}}]).toArray(function(err,result){                                  
              if(result[0])
              {
                //console.log(result[0].count); 
                if(result[0].count === 1)
                  response.write(JSON.stringify(result[0]));
                else
                  response.write("0");                         
              }
              else
              {
                response.write("0");
              }
              client.close();
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
                db.collection('partides').insertOne({"_id":partida._id, "complerta":partida.complerta, "torn":partida.torn, "jugadors":partida.jugadors,"tauler":partida.tauler});
                assert.equal(err, null);
                console.log("Afegit document a col·lecció partides");                        
        });
      }

      /* Afegeix el jugador enviat com a primer argument a la partida amb el id passat com a segon i posa el
         atribut complerta de la partida a true */
      static afegirJugador(j,idpartida){                                             
        MongoClient.connect(cadenaConnexio,function(err,client){
          var db = client.db('partides'); 
          /* Obtenir la partida amb un jugador */
          let p = new Promise((resolver,reject)=>{
              db.collection('partides').findOne({_id:idpartida},function(err,result){
                //console.log("Resultado: " + result._id );
                resolver(result);                
              })          
          });
          // Afegir el nou jugador a la partida trobada y posar complerta a true
          p.then((partida) => { 
             db.collection('partides').updateOne({ _id: partida._id},{$set: {"jugadors.1": j,"complerta":true}});
            });
      });
    }
      
      static obtenirJugadors(response)
      {    
            MongoClient.connect(cadenaConnexio,async function(err,client){
                var db = client.db('partides');    
                let p = new Promise((resolver,reject)=>{                                          
                    db.collection('partides').find({}).toArray((function(err,result){                    
                    result.forEach(x => console.log(x));
                    let resposta = "";
                    result.forEach(x => resposta += JSON.stringify(x));
                    resolver(resposta);                    
                }))
                //console.log("Promise: " + Object.keys(promise));                
            });
            p.then((resposta)=>{
              response.write(resposta);
              response.end();});
      });
    }

      /* Obté la partida corresponent al id passat com a argument i la envia en format json */
      static consultaEstado(nom,id,response)
      {
        /*
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides');     
          db.collection('partides').find({_id:id},{complerta:1,tauler:1}).toArray((function(err,result){                                
            if(result.length > 0)
            {              
              response.write(JSON.stringify(result[0]));
            }
            response.end();                      
          }))
        });
        */
        
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides');    
          let p = new Promise((resolver,reject)=>{
            db.collection('partides').find({_id:id},{complerta:1,tauler:1}).toArray((function(err,result){                                
              resolver(result);
            }));
          }); 
          p.then((result) =>{
            if(result && result.length > 0)
            {              
              response.write(JSON.stringify(result[0]));
            }
            response.end();      
          })
        });
      }

      /* Afegeix la fitxa pasada pasada com a tercer argument al la casella amb la fila i columna pasades
         com a primer i segon arguments a la partida amb id passat com a quart argument */
      static afegirFitxa(fila,columna,color,id,response)
      {
        //console.log("Id de la partida: " + id);
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides'); 
          /* Obtenir la partida amb un jugador */
          let p = new Promise((resolver,reject)=>{
              db.collection('partides').findOne({_id:id},function(err,result){
                //console.log("Resultado: " + result._id );
                resolver(result);                
              })          
          });
          // Afegir la fitxa a la casella de partida trobada en els index indicats
          p.then((partida) => { 
             let r =db.collection('partides').updateOne({ _id: partida._id},{$set: {["tauler."+fila+"."+columna]: color*1}});             
             response.end();
            });
      });
    }

    static calculaRepercusions(id,response,fila,columna)
    {
      console.log("Fila: " + fila + " Columna: " + columna)
        //console.log("Id de la partida: " + id);
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides'); 
          /* Obtenir la partida amb un jugador */
          let p = new Promise((resolver,reject)=>{
              db.collection('partides').findOne({_id:id},function(err,result){
                console.log("Resultado: " + result._id );
                resolver(result);                
              })          
          });
          // Afegir la fitxa a la casella de partida trobada en els index indicats
          p.then((partida) => {
            //console.log("Partida en DAO: " + Object.keys(partida));
            let tauler = partida.tauler;
            //console.log("Tauler en DAO: " + tauler);
            tauler = DAOMongo.comprobarFiles(tauler,fila);
            /* canviar de jugador */
            //console.log("Partida torn: " + partida.torn);
            partida.torn = (partida.torn === 'b')?'n':'b';
            //console.log("Partida torn: " + partida.torn);
            db.collection('partides').updateOne({ _id: partida._id},{$set: {"torn": partida.torn}});             
            /* actualitzar el tauler */
            db.collection('partides').updateOne({ _id: partida._id},{$set: {"tauler": tauler}});          
            response.end();
          });
        });
     }
      
static comprobarFiles(tauler,indexfila)
{
    let fila = tauler[indexfila];
    fila = DAOMongo.comprobarFila(fila);
  return tauler;
}
    
static comprobarFila(fila)
{
  for(let i = 0; i < 7;i++)
  {
    let casella = fila[i];
    if(casella < 0)
      continue;
    for(let j = i+1; j < 8;j++)
    {
      let casella2 = fila[j];
      if(casella2 < 0)
        break;
      if(casella === casella2)
      {
        for(let n = i; n < j;n++)
          fila[n] = casella;
      }
    }
  }
  return fila;
}// Fi de comprobar fila
      
    



}//Fi de la classe




module.exports=DAOMongo;