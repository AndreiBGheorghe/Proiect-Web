const express = require("express");
const fs= require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const Client=require('pg').Client;

var client= new Client({database:"articole",
        user:"spiry",
        password:"171515",
        host:"localhost",
        port:5432});
client.connect();

client.query("select * from articole", function(err,rez){
    console.log(rez);
})

vect_foldere=["temp","temp1"]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder))
        fs.mkdirSync(caleFolder)
}

obGlobal={
    obErori:null,
    obImagini:null,
    folderCss:path.join(__dirname,"resurse/css"),
    folderScss:path.join(__dirname,"resurse/scss"),
    folderBackup:path.join(__dirname,"backup"),
}

vect_foldere=["temp","temp1","backup"]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname,folder)
    if (!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

app=express();
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

app.set("view engine","ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use(function(req,res,next){
    client.query("select * from unnest(enum_range(null::tip_articol))",function(err,rezOptiuni){
        res.locals.optiuniMeniu=rezOptiuni.rows
        next();
    })
})

app.get(["/","/index","/home"], function(req,res){
    res.render("pagini/index", {ip:req.ip, imagini:obGlobal.obImagini.imagini});
})

app.get("/galerie", function(req,res){
    res.render("pagini/galerie", {ip:req.ip, imagini:obGlobal.obImagini.imagini});
})

app.get("/produse", function(req, res){
    var conditieQuery="";
    if (req.query.tip){
        conditieQuery=` where tip_produs='${req.query.tip}'`
    }
    client.query("select * from unnest(enum_range(null::tip_articol))", function(err, rezOptiuni){
        client.query(`select * from articole ${conditieQuery}`, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})

app.get("/produs/:id", function(req, res){
    client.query(`select * from articole where id=${req.params.id}`, function(err, rez){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            res.render("pagini/produs", {prod: rez.rows[0]})
        }
    })
})

app.get("/promotii", function(req,res){
    res.render("pagini/promotii");
})

app.get("/", function(req,res){
    res.render("pagini/index");
})

app.get("/favicon.ico", function(req,res){
    res.sendFile(path.join(__dirname, "resurse/ico/favicon.ico"))
})

app.get(new RegExp("^\/[a-z0-9A-Z\/]*\/$"), function(req,res){
    afisareEroare(res,403);
})

app.get("/*.ejs", function(req,res){
    afisareEroare(res,400)
})

app.get("/*", function(req,res){
    console.log(req.url);
    try{
        res.render("pagini"+req.url, function(err,rezHtml){
            if (err){
                if (err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404);
                    console.log("Nu a gasit pagina ", req.url)
                }
            }
            else{
                res.send(rezHtml+"");
            }
        })
    }
    catch(err1){
        if (err1){
            if (err1.message.startsWith("Cannot find module")){
                afisareEroare(res, 404);
                console.log("Nu a gasit resursa ", req.url)
            }
            else{
                afisareEroare(res)
                console.log("Eroare:"+err1)
            }
        }
    }
})

function initErori(){
    var continut=fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("UTF-8")
    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza,eroare.imagine)
    }
    console.log(obGlobal.obErori);
    obGlobal.obErori.eroare_default.imagine==path.join(obGlobal.obErori.cale_baza,obGlobal.obErori.eroare_default.imagine)
}

function afisareEroare(res, _identificator, _titlu, _text, _imagine){
    let eroare=obGlobal.obErori.info_erori.find(
        function(elem){
            return elem.identificator==_identificator
        }
    )
    if (!eroare){
        let eroare_default=obGlobal.obErori.eroare_default
        res.render("pagini/eroare",{
            titlu: _titlu || eroare_default.titlu,
            text: _text || eroare_default.text,
            imagine: _imagine || eroare_default.imagine,
        })
    }
    else{
        if (eroare.status)
            res.status(eroare.identificator)
        res.render("pagini/eroare",{
            titlu: _titlu || eroare.titlu,
            text: _text || eroare.text,
            imagine: _imagine || eroare.imagine,
        })
    }
}
initErori()

function initImagini(){
    var continut=fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);
    for (let imag of vImagini){
        [numeCale, ext]=imag.cale_relativa.split(".");
        let caleRel=path.join(caleAbs,imag.cale_relativa);
        let caleRelMediu=path.join(caleAbsMediu, numeCale+".webp");
        let caleRelMic=path.join(caleAbsMic, numeCale+".webp");
        sharp(caleRel).resize(300).toFile(caleRelMediu);
        sharp(caleRel).resize(200).toFile(caleRelMic);
        imag.cale_relativa_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeCale+".webp")
        imag.cale_relativa_mic=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeCale+".webp")
        imag.cale_relativa=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_relativa)
    }
    console.log(obGlobal.obImagini)
}
initImagini();

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
}

vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.listen(8080);
console.log("Serverul a pornit");