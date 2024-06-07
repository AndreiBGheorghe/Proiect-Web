const Drepturi=require('./drepturi.js');

class Rol{
    /**
    * @returns {string} Tipul de rol, implicit - generic
    */
    static get tip() {return "generic"}
    /**
    * @returns {Array<Symbol>} Lista drepturilor asociate rolului, implicit - [] (goala)
    */
    static get drepturi() {return []}
    constructor (){
        this.cod=this.constructor.tip;
    }
    /**
    * @param {Symbol} drept Dreptul de verificat
    * @returns {boolean} True daca rolul are dreptul specificat, altfel false
    */
    areDreptul(drept){
        return this.constructor.drepturi.includes(drept);
    }
}
class RolAdmin extends Rol{
    /**
    * @returns {string} Tipul de rol - admin
    */
    static get tip() {return "admin"}
    constructor (){
        super();
    }
    /**
    * @returns {boolean} True intotdeauna, deoarece adminul are toate drepturile
    */
    areDreptul(){
        return true;
    }
}
class RolModerator extends Rol{
    /**
    * @returns {string} Tipul de rol - moderator
    */
    static get tip() {return "moderator"}
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori,
        Drepturi.vizualizareGrafice,
        Drepturi.vizualizareGalerie
    ] }
    constructor (){
        super()
    }
}
class RolClient extends Rol{
    /**
    * @returns {string} Tipul de rol - comun
    */
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse,
        Drepturi.vizualizareGalerie,
        Drepturi.vizualizareProduse
    ] }
    constructor (){
        super()
    }
}
class RolFactory{
    /**
    * @param {string} tip Tipul de rol (admin, moderator, comun)
    * @returns {Rol} Obiectul de tip Rol creat
    */
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
        }
    }
}

module.exports={RolFactory:RolFactory, RolAdmin:RolAdmin}