class Partida{
    constructor()
    {
        this._id = Partida.generaid();
        this.complerta = false;
        this.torn = "b";
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
        this.tauler[3][3] = 1;
        this.tauler[4][4] = 1;
        //fitxes negres inicials
        this.tauler[3][4] = 0;
        this.tauler[4][3] = 0;
        //console.log(this.tauler);
    }

    static generaid()
    {
        let token1 = Math.random().toString(36).substr(2);
        let token2 = Math.random().toString(36).substr(2);
        return token1+token2;
    }
}

module.exports=Partida;