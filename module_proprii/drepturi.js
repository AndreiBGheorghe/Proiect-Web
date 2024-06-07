/**
* @typedef Drepturi
* @type {Object}
* @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori
* @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
* @property {Symbol} cumparareProduse Dreptul de a cumpara
* @property {Symbol} stergereProduse Dreptul de a sterge produse
* @property {Symbol} vizualizareProduse Dreptul de a vizualiza produsele
* @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
* @property {Symbol} vizualizareGalerie Dreptul de a vizualiza galeria
*/
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	stergereProduse: Symbol("stergereProduse"),
	vizualizareProduse: Symbol("vizualizareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice"),
	vizualizareGalerie: Symbol("vizualizareGalerie")
}
/**
* @name module.exports.Drepturi
* @type Drepturi
*/
module.exports=Drepturi;