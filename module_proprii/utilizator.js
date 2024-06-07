const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');
const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");

class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="andrei.gheorghe.web@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;
    /**
    * Constructorul clasei Utilizator
    * @param {Object} options Optiuni pentru initializarea utilizatorului
    * @param {number} options.id ID-ul utilizatorului
    * @param {string} options.username Numele de utilizator
    * @param {string} options.nume Numele utilizatorului
    * @param {string} options.prenume Prenumele
    * @param {string} options.email Adresa de email
    * @param {string} options.parola Parola
    * @param {Rol|RolAdmin|RolModerator|RolClient} options.rol - Rolul utilizatorului
    * @param {string} [options.culoare_chat="black"] Culoarea pentru chat, implicit - "black"
    * @param {string} [options.poza] Calea catre imaginea de profil
    */
    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}) {
        this.id=id;
        try{
            if(this.checkUsername(username))
                this.username = username;
            else
                throw new Error("Username incorect")
        }
        catch(e){this.#eroare=e.message}
        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);
        this.#eroare="";
    }
    /**
    * @param {string} nume Numele de verificat
    * @returns {boolean} True daca numele este valid, altfel false
    */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }
    /**
    * @param {string} nume Noul nume pentru utilizator
    * @throws {Error} Daca numele nu este valid
    */
    set setareNume(nume){
        if (this.checkName(nume))
            this.nume=nume
        else
            throw new Error("Nume gresit")
    }
    /**
    * @param {string} username Noul username pentru utilizator
    * @throws {Error} Daca username-ul nu este valid
    */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }
    /**
    * @param {string} username Username-ul de verificat
    * @returns {boolean} True daca username-ul este valid, altfel false
    */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }
    /**
    * @param {string} parola Parola de criptat
    * @returns {string} Parola criptata
    */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }
    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
    /**
    * @param {string} subiect Subiectul emailului
    * @param {string} mesajText Mesajul text al emailului
    * @param {string} mesajHtml Mesajul HTML al emailului
    * @param {Array<Object>} [atasamente=[]] Lista de atasamente, implicit - [] (goala)
    * @throws {Error} Daca apar erori in timpul trimiterii emailului
    */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{
                user:Utilizator.emailServer,
                pass:"elxhishlqjdzbymv"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email,
            subject:subiect,
            text:mesajText,
            html: mesajHtml,
            attachments: atasamente
        })
    }
    /**
    * @param {string} username Numele de utilizator cautat
    * @returns {Promise<Utilizator|null>} Un obiect Utilizator sau null daca nu se gaseste
    */
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
    }
    /**
    * @param {string} username Numele de utilizator cautat
    * @param {Object} obparam Parametri suplimentari pentru procesare
    * @param {Function} proceseazaUtiliz Functia de procesare a utilizatorului gasit
    * @returns {Utilizator|null} Un obiect Utilizator sau null daca nu se gaseste
    */
    static getUtilizDupaUsername(username,obparam,proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }
    /**
    * @param {Symbol} drept Dreptul de verificat
    * @returns {boolean} True daca utilizatorul are dreptul specificat, altfel false
    */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
    /**
     * @param {Object} parametri Parametrii pentru modificare
     * @param {number} parametri.id ID-ul utilizatorului
     * @param {string} parametri.username Noul username al utilizatorului
     * @param {string} parametri.nume Noul nume al utilizatorului
     * @param {string} parametri.prenume Noul prenume
     * @param {string} parametri.email Noul email
     * @param {string} parametri.parola Noua parola
     * @param {string} parametri.rol Noul rol al utilizatorului
     * @param {string} [parametri.culoare_chat="black"] - Noua culoare pentru chat
     * @param {string} [parametri.poza] - Noua poza de profil
     */
    modifica({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}){
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function(err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1
            }
            else{
                let updateData = {id, username, nume, prenume, email, parola, rol, culoare_chat, poza};
                AccesBD.getInstanta(Utilizator.tipConexiune).updateParametrizat({tabel:"utilizatori",campuri:['*'],valori:updateData,conditiiAnd:[`username='${username}'`]}, function(err, rezUpdate){
                    if(err){
                        console.error("Eroare la actualizarea utilizatorului:", err);
                        throw new Error("Eroare la actualizarea utilizatorului");
                    }
                    else{
                        console.log("Utilizator actualizat cu succes");
                    }
                });
            }
        });
    }
    /**
    * @param {string} username Username-ul utilizatorului de sters
    */
    sterge(username){
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function(err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            else{
                AccesBD.getInstanta(Utilizator.tipConexiune).delete({tabel:"utilizatori",conditiiAnd:[`username='${username}'`]}, function(err, rezDelete){
                    if(err){
                        console.error("Eroare la ștergerea utilizatorului:", err);
                        throw new Error("Eroare la ștergerea utilizatorului");
                    }
                    else{
                        console.log("Utilizator șters cu succes");
                    }
                });
            }
        });
    }
    /**
     * @param {Object} obparam Parametrii de cautare
     * @param {Function} callback - Functia de callback care primeste rezultatul cautarii
     */
    static cauta(obparam, callback) {
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd: Object.entries(obparam).filter(([_, value]) => value !== undefined).map(([key, value]) => `${key}='${value}'`)}, function(err, rezSelect){
            if(err){
                console.error("Eroare la căutarea utilizatorului:", err);
                callback(err, []);
            }
            else{
                callback(null, rezSelect.rows);
            }
        });
    }
    /**
     * @param {Object} obparam Parametrii de cautare
     * @returns {Promise<Array<Object>>} Un array de utilizatori care corespund criteriilor de cautare
     */
    static async cautaAsync(obparam) {
        try{
            let rezSelect=await AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd: Object.entries(obparam).filter(([_, value]) => value !== undefined).map(([key, value]) => `${key}='${value}'`)});
            return rezSelect ? rezSelect.rows : [];
        }
        catch(err){
            console.error("Eroare la căutarea utilizatorului:", err);
            return [];
        }
    }    
}

module.exports={Utilizator:Utilizator}