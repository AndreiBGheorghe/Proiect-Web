const {Client, Pool}=require("pg");

class AccesBD{
    static #instanta=null;
    static #initializat=false;
    constructor() {
        if(AccesBD.#instanta){
            throw new Error("Deja a fost instantiat");
        }
        else if(!AccesBD.#initializat){
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }
    initLocal(){
        this.client= new Client({database:"articole",
            user:"spiry", 
            password:"171515", 
            host:"localhost", 
            port:5432});
        this.client.connect();
    }
    /**
    * @returns {Object} - Clientul pentru baza de date.
    * @throws {Error} Arunca o eroare daca clasa nu a fost înca instantiata
    */
    getClient(){
        if(!AccesBD.#instanta ){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }
    /**
    * @param {Object} init Un obiect cu datele pentru query.
    * @param {string} [init.init="local"] Tipul de conexiune ("local", "render", etc.)
    * @returns {AccesBD} Instanta unica a clasei
    */
    static getInstanta({init="local"}={}){
        console.log(this);
        if(!this.#instanta){
            this.#initializat=true;
            this.#instanta=new AccesBD();
            try{
                switch(init){
                    case "local":this.#instanta.initLocal();
                }
            }
            catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }
        }
        return this.#instanta;
    }
    /**
     * @param {Object} obj Un obiect cu datele pentru query
     * @param {string} obj.tabel Numele tabelului
     * @param {string[]} [obj.campuri=[]] Lista de stringuri cu numele coloanelor afectate de query, poate cuprinde si elementul "*"
     * @param {string[]} [obj.conditiiAnd=[]] Lista de stringuri cu conditii pentru where
     * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
     * @param {Array} [parametriQuery=[]] Parametrii optionali pentru query
     */
    select({tabel="",campuri=[],conditiiAnd=[]} = {}, callback, parametriQuery=[]){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`; 
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        this.client.query(comanda,parametriQuery, callback)
    }
    /**
    * @param {Object} obj Un obiect cu datele pentru query
    * @param {string} obj.tabel Numele tabelului
    * @param {string[]} [obj.campuri=[]] Lista de stringuri cu numele coloanelor afectate de query, poate cuprinde si elementul "*"
    * @param {string[]} [obj.conditiiAnd=[]] Lista de stringuri cu conditii pentru where
    * @returns {Object|null} Rezultatul query-ului sau null in caz de eroare
    */
    async selectAsync({tabel="",campuri=[],conditiiAnd=[]} = {}){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:",comanda);
        try{
            let rez=await this.client.query(comanda);
            return rez;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }
    /**
    * @param {Object} obj Un obiect cu datele pentru query
    * @param {string} obj.tabel Numele tabelului
    * @param {Object} [obj.campuri={}] Un obiect cu perechi cheie-valoare reprezentand coloanele si valorile acestora pentru inserare
    * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
    */
    insert({tabel="",campuri={}} = {}, callback){
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda=`insert into ${tabel}(${Object.keys(campuri).join(",")}) values ( ${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }
    /**
    * @param {Object} obj Un obiect cu datele pentru query
    * @param {string} obj.tabel Numele tabelului
    * @param {Object} [obj.campuri={}] Un obiect cu perechi cheie-valoare reprezentand coloanele si valorile acestora pentru actualizare
    * @param {string[]} [obj.conditiiAnd=[]] Lista de stringuri cu conditii pentru where
    * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
    * @param {Array} [parametriQuery] Parametrii optionali pentru query
    */  
    update({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
        let campuriActualizate=[];
        for(let prop in campuri)
            campuriActualizate.push(`${prop}='${campuri[prop]}'`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        this.client.query(comanda,callback)
    }
    /**
    * @param {Object} obj Un obiect cu datele pentru query
    * @param {string} obj.tabel Numele tabelului
    * @param {string[]} [obj.campuri=[]] Lista de stringuri cu numele coloanelor afectate de query
    * @param {string[]} [obj.valori=[]] Lista de valori pentru coloanele actualizate
    * @param {string[]} [obj.conditiiAnd=[]] Lista de stringuri cu conditii pentru where
    * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
    * @param {Array} [parametriQuery] Parametrii optionali pentru query
    */
    updateParametrizat({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        this.client.query(comanda,valori, callback)
    }
    /**
    * @param {Object} obj Un obiect cu datele pentru query
    * @param {string} obj.tabel Numele tabelului
    * @param {string[]} [obj.conditiiAnd=[]] Lista de stringuri cu conditii pentru where
    * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
    */
    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        this.client.query(comanda,callback)
    }
    /**
    * @param {string} comanda Comanda SQL de executat
    * @param {QueryCallBack} callback O functie callback cu 2 parametri: eroare si rezultatul query-ului
    */
    query(comanda, callback){
        this.client.query(comanda,callback);
    }
}

module.exports=AccesBD;