var MongoClient = require('mongodb').MongoClient;
var cadenaConnexio = 'mongodb://localhost:27017/partides';
let assert = require('assert');
const Partida = require('./Partida');


class DAOMongo{


        /* Cerca una partida amb un sol jugador, si existeix, envia les dades de la partida i si no, envia 0 */
        static partidaUnJugador(response)
        {
          response.writeHead(200, {"Content-Type": "application/json"});       
          MongoClient.connect(cadenaConnexio,function(err,client){
            var db = client.db('partides');            
            db.collection('partides').aggregate([{$project:{count:{$size:"$jugadors"}}}]).toArray(function(err,result){                                  
              if(result[0])
              {                
                if(result[0].count === 1)
                  response.write(JSON.stringify(result[0]));
                else
                  response.write(JSON.stringify("0"));                         
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
            });
            p.then((resposta)=>{
              response.writeHead(200, {"Content-Type": "application/json"});       
              response.write(resposta);
              response.end();});
      });
    }

      /* Obté la partida corresponent al id passat com a argument i la envia en format json */
      static consultaEstado(nom,id,response)
      {         
        MongoClient.connect(cadenaConnexio,function(err,client){
          var db = client.db('partides'); 
          // Obtenir la partida amb un jugador 
              db.collection('partides').findOne({_id:id},function(err,result){
                //console.log("Resultado: " + result._id );
                client.close();    
                response.writeHead(200, {"Content-Type": "application/json"});       
                response.write(JSON.stringify(result));
                response.end();   
              })          
       });
      }
      

      /* Afegeix la fitxa pasada pasada com a tercer argument al la casella amb la fila i columna pasades
         com a primer i segon arguments a la partida amb id passat com a quart argument */
      static afegirFitxa(fila,columna,color,id,response)
      {        
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides'); 
          /* Obtenir la partida amb un jugador */
          let p = new Promise((resolver,reject)=>{
              db.collection('partides').findOne({_id:id},function(err,result){                
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
        MongoClient.connect(cadenaConnexio,async function(err,client){
          var db = client.db('partides'); 
          // Obtenir la partida amb un jugador 
          let p = new Promise((resolver,reject)=>{
              db.collection('partides').findOne({_id:id},function(err,result){
                console.log("Resultado: " + result._id );
                resolver(result);                
              })          
          });
          // Afegir la fitxa a la casella de partida trobada en els index indicats
          p.then((partida) => {            
            let tauler = partida.tauler;    
            /*                    
            tauler = DAOMongo.comprobarFiles(tauler,fila);
            tauler = DAOMongo.comprobarDiagonalD(tauler,fila,columna);
            tauler = DAOMongo.comprobarColumnes(tauler,columna);
            tauler = DAOMongo.comprobarDiagonalI(tauler,fila,columna);
            */
            DAOMongo.comprovarTot(tauler);            
            let puntuacions = DAOMongo.comprobarPunts(tauler);            
            partida.jugadors[0].fitxes = puntuacions[0];
            partida.jugadors[1].fitxes = puntuacions[1];            
            //Actualitzar el tauler i canviar de jugador             
            partida.torn = (partida.torn === 'b')?'n':'b';            
            db.collection('partides').updateOne({ _id: partida._id},{$set: {"tauler": tauler,"torn":partida.torn,"jugadors.0.fitxes":partida.jugadors[0].fitxes,"jugadors.1.fitxes":partida.jugadors[1].fitxes}});         
            response.writeHead(200, {"Content-Type": "application/json"});       
            response.write(JSON.stringify(partida));
            response.end();
          });
        });
     }
      
     static comprovarTot(tauler)
     {
      tauler = DAOMongo.comprobarDiagonalD(tauler);
      tauler = DAOMongo.comprobarDiagonalI(tauler);  
      tauler = DAOMongo.comprobarFiles(tauler);
      tauler = DAOMongo.comprobarColumnes(tauler);    
     }
     

     //----------------------------------------------------------------------------
        /* Considerant no més la fila, columna i diagonals on s'ha posat la fitxa*/
     //----------------------------------------------------------------------------

    /*
    static comprobarFiles(tauler,indexfila)
    {
        let fila = tauler[indexfila];
        fila = DAOMongo.comprobarFila(fila);
      return tauler;
    }

    static comprobarColumnes(tauler,indexcolumna)
    {
      let columna = [];
      for(let i = 0; i < 8;i++)
      {
        columna.push(tauler[i][indexcolumna]);
      }
      columna = DAOMongo.comprobarFila(columna);
      for(let i = 0; i < 8;i++)
      {
        tauler[i][indexcolumna] = columna[i];
      }
      return tauler;
    }

    static comprobarDiagonalD(tauler,indexfila,indexcolumna)
    {
      let diagonal = [];
      //Anar a la primera fila i columna de la diagonal
      let fila = indexfila;
      let columna = indexcolumna;
      while(fila > 0 && columna > 0)
      {
        fila--;
        columna--;
      }
      //console.log("Fila: " + fila + " Columna: " + columna);
      //Ficar la diagonal en una array
      let inicifila = fila;
      let inicicolumna = columna;
      while(inicifila < 8 && inicicolumna < 8)
      {
        diagonal.push(tauler[inicifila][inicicolumna]);
        inicifila++;
        inicicolumna++;
      }
      DAOMongo.comprobarFila(diagonal);
      for(let i = 0; i < diagonal.length;i++,columna++,fila++)
      {
        tauler[fila][columna] = diagonal[i]; 
      }
      return tauler;
    }
      

    static comprobarDiagonalI(tauler,indexfila,indexcolumna)
    {
      let diagonal = [];
      //Anar a la primera fila i columna de la diagonal
      let fila = indexfila;
      let columna = indexcolumna;
      while(fila > 0 && columna < 8)
      {
        fila--;
        columna++;
      }
      //console.log("Fila: " + fila + " Columna: " + columna);
      //Ficar la diagonal en una array
      let inicifila = fila;
      let inicicolumna = columna;
      while(inicifila < 8 && inicicolumna > 0)
      {
        diagonal.push(tauler[inicifila][inicicolumna]);
        inicifila++;
        inicicolumna--;
      }
      DAOMongo.comprobarFila(diagonal);
      for(let i = 0; i < diagonal.length;i++,columna--,fila++)
      {
        tauler[fila][columna] = diagonal[i]; 
      }
      return tauler;
    }

    static comprobarFila(fila)
    {
      for(let i = 0; i < fila.length-1;i++)
      {
        let casella = fila[i];
        if(casella < 0)
          continue;
        for(let j = i+1; j < fila.length;j++)
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
    */

//---------------------------------------------------------------------------
          /* Considerant totes les files, columnes i diagonals */
//---------------------------------------------------------------------------

static comprobarFiles(tauler,indexfila)
{
  for(let i = 0; i < 8; i++)
  {
    let fila = tauler[i];
    fila = DAOMongo.comprobarFila(fila);
  }
  return tauler;
}

static comprobarColumnes(tauler,indexcolumna)
{
  for(let j = 0; j < 8; j++)
  {
    let columna = [];
    for(let i = 0; i < 8;i++)
    {
      columna.push(tauler[i][j]);
    }
    columna = DAOMongo.comprobarFila(columna);
    for(let i = 0; i < 8;i++)
    {
      tauler[i][j] = columna[i];
    }
  }
  return tauler;
}

static comprobarDiagonalD(tauler,indexfila,indexcolumna)
{
  //Comprovar les 6 primeres diagonals a la dreta que comencen a la columna 0
  for(let i = 0; i < 6; i++)
  {
    let diagonal = [];
    let columna = 0;
    for(let fila = i;fila < 8;fila++,columna++)
     diagonal.push(tauler[fila][columna]);
    diagonal = DAOMongo.comprobarFila(diagonal);
    columna = 0;
    for(let fila = i;fila < 8;fila++,columna++)
     tauler[fila][columna] = diagonal[columna];
  }
  //Comprovar les 5 diagonals que comencen a la primera fila
  for(let j = 1;j < 6;j++)
  {
    let diagonal = [];
    let fila = 0;
    for(let columna = j; columna<8;columna++,fila++)
      diagonal.push(tauler[fila][columna])
    diagonal = DAOMongo.comprobarFila(diagonal);
    fila = 0;
    for(let columna = j;columna < 8;columna++,fila++)
     tauler[fila][columna] = diagonal[fila];
  }
  return tauler;
}
  

static comprobarDiagonalI(tauler,indexfila,indexcolumna)
{
  //Comprovar les 6 primeres diagonals a la esquerra que comencen a la columna 8
  for(let i = 0; i < 6; i++)
  {
    let diagonal = [];
    let columna = 7;
    for(let fila = i;fila < 8;fila++,columna--)
     diagonal.push(tauler[fila][columna]);
    diagonal = DAOMongo.comprobarFila(diagonal);
    columna = 7;
    for(let fila = i;fila < 8;fila++,columna--)
     tauler[fila][columna] = diagonal[7-columna];
  }
  //Comprovar les 5 diagonals que comencen a la primera fila
  for(let j = 7;j > 2;j--)
  {
    let diagonal = [];
    let fila = 0;
    for(let columna = j; columna>0;columna--,fila++)
      diagonal.push(tauler[fila][columna])
    diagonal = DAOMongo.comprobarFila(diagonal);
    fila = 0;
    for(let columna = j;columna > 0;columna--,fila++)
     tauler[fila][columna] = diagonal[fila];
  }
  return tauler;
}

static comprobarFila(fila)
{
  for(let i = 0; i < fila.length-1;i++)
  {
    let casella = fila[i];
    if(casella < 0)
      continue;
    for(let j = i+1; j < fila.length;j++)
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
 

//-----------------------------------------------


static comprobarPunts(tauler)
{
  let pb = 0;
  let pn = 0;
  for(let i = 0; i < 8;i++)
  {
    for(let j = 0; j < 8;j++)
    {
      if(tauler[i][j]=== 0)
        pn++;
      else if(tauler[i][j] === 1)
        pb++;
    }
  }
  return [pb,pn]
}

static esborraPartida(id,res)
{
  MongoClient.connect(cadenaConnexio,async function(err,client){
    var db = client.db('partides'); 
    // Esborrar la partida
    let p = new Promise((resolver,reject)=>{
        db.collection('partides').deleteOne({_id:id},function(err,result){
          console.log("Partida esborrada " + id );
          resolver(result);                
        })          
    });
    // Afegir la fitxa a la casella de partida trobada en els index indicats
    p.then(() => {
      res.write("Partida: " + id + " Esborrada",'utf-8');
      res.end();      
    });
  });
}


}//Fi de la classe




module.exports=DAOMongo;