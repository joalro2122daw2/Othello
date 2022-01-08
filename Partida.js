class Partida{
    constructor()
    {
        //this.id = id;
        this.jugadors = [];
        this.tauler = [];
        this.iniciaTauler();
    }
// Partida en mongo:  { "_id" : ObjectId("61d6b81239e03e8b24fe44d3"), "id" : 1, "jugadors" : [ { "nom" : "Jose Antonio", "fitxes" : 2, "color" : "b" } ], "tauler" : [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 1, 0, -1, -1 ], [ -1, -1, -1, -1, 0, 1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ] }

    iniciaTauler()
    {
        for(let i = 0; i < 8; i++)
        {
            this.tauler.push([]);
            for(let j = 0; j < 8; j++)
            {
                this.tauler[i].push(-1);
            }
        }
        //fitxes blanques inicials
        this.tauler[4][4] = 1;
        this.tauler[5][5] = 1;
        //fitxes negres inicials
        this.tauler[4][5] = 0;
        this.tauler[5][4] = 0;
        //console.log(this.tauler);
    }
}

module.exports=Partida;