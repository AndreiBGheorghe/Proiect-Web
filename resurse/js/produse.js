window.addEventListener("load", function(){
    document.getElementById("inp-dimensiune").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }
    function contineCaractereSpc(str) {
        let caractere="!@#$%^&*()-_=+[{]};:'\",<.>/?\\|";
        for (var i = 0; i < str.length; i++) {
            if (caractere.indexOf(str[i]) !== -1) {
                return true;
            }
        }
        return false;
    }
    document.getElementById("filtrare").onclick=function(){
        var contor=true;
        var inpNume=document.getElementById("inp-nume").value.trim().toLowerCase();
        if(contineCaractereSpc(inpNume)){
            if(confirm("Numele introdus nu este valid")){
                document.getElementById("inp-nume").value="";
                contor=false;
            }
        }
        if(contor){
            var vRadio1=document.getElementsByName("gr_rad");
            var vRadio2=document.getElementsByName("gr_radio");
            var inpPret;
            var inpDeStrada;
            var inpDimensiune=parseInt(document.getElementById("inp-dimensiune").value)
            var inpTip=document.getElementById("inp-tip_produs").value.trim().toLowerCase();
            var inpCuloare=document.getElementById("inp-culoare_principala").value.trim().toLowerCase();
            var inpBrand=document.getElementById("inp-brand").value.trim().toLowerCase();
            var produse=document.getElementsByClassName("produs");
            let minPret, maxPret;
            for (let r of vRadio1){
                if (r.checked){
                    inpPret=r.value;
                    break;
                }
            }
            for (let x of vRadio2){
                if (x.checked){
                    inpDeStrada=x.value;
                    break;
                }
            }
            if (inpPret!="toate"){
                var aux=inpPret.split(":")
                minPret=parseInt(aux[0])
                maxPret=parseInt(aux[1])
            }
            for (let produs of produse){
                let valNume=produs.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
                let cond1=valNume.startsWith(inpNume);
                let valPret=parseInt(produs.getElementsByClassName("val-pret")[0].innerHTML);
                let cond2=(inpPret=="toate" || (minPret<=valPret && valPret<maxPret));
                let valDimensiune=parseInt(produs.getElementsByClassName("val-dimensiune")[0].innerHTML);
                let cond3=valDimensiune>inpDimensiune;
                let valTip=produs.getElementsByClassName("val-tip_produs")[0].innerHTML.trim().toLowerCase();
                let cond4=(inpTip=="toate" || inpTip==valTip);
                let valBrand=produs.getElementsByClassName("val-brand")[0].innerHTML.trim().toLowerCase();
                let cond5=(inpBrand=="toate" || inpBrand==valBrand);
                let valCuloare=produs.getElementsByClassName("val-culoare_principala")[0].innerHTML.trim().toLowerCase();
                let cond6=(inpCuloare=="toate" || inpCuloare==valCuloare);
                let valDeStrada=produs.getElementsByClassName("val-de_strada")[0].innerHTML.trim().toLowerCase();
                let cond7=(inpDeStrada=="toate" || inpDeStrada==valDeStrada);
                if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7){
                    produs.style.display="block";
                }
                else{
                    produs.style.display="none";
                }
            }
        }
    }
    document.getElementById("resetare").onclick= function(){  
        if (confirm("Sunteti de acord sa resetati filtrele?")){
            document.getElementById("inp-nume").value="";
            document.getElementById("i_rad1").checked=true;
            document.getElementById("inp-dimensiune").value=document.getElementById("inp-dimensiune").min;
            document.getElementById("infoRange").innerHTML="(0)";
            document.getElementById("inp-tip_produs").value="toate";
            document.getElementById("inp-brand").value="toate";
            document.getElementById("inp-culoare_principala").value="toate";
            document.getElementById("i_radio1").checked=true;
            var produse=document.getElementsByClassName("produs");
            for (let prod of produse){
                prod.style.display="block";
            }
            //location.reload();
        }
    }
    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        let x_produse=Array.from(produse)
        x_produse.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-brand")[0].innerHTML)
            let pret_b=parseInt(b.getElementsByClassName("val-brand")[0].innerHTML)
            if (pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-brand")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-brand")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        })
        let v_produse=Array.from(x_produse)
        v_produse.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML)
            let pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML)
            if (pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-pret")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-pret")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        })
        for (let prod of v_produse){
            prod.parentNode.appendChild(prod)
        }
    }
    document.getElementById("sortCrescNume").onclick= function(){
        sorteaza(1)
    }
    document.getElementById("sortDescrescNume").onclick= function(){
        sorteaza(-1)
    }
    window.onkeydown = function (e) {
        if (e.key == "c" && e.altKey) {
            var suma = 0;
            var produse = document.getElementsByClassName("produs");
            for (let produs of produse) {
                var stil = getComputedStyle(produs);
                if (stil.display!= "none") {
                    suma += parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
                }
            }
            let p=document.createElement("p");
            p.innerHTML=suma;
            p.id="par_suma";
            let container=document.getElementById("produse")
            container.insertBefore(p,container.children[0])
            setTimeout(function(){
                let par=document.getElementById("par_suma")
                if(par){
                    par.remove()
                }
            }, 2000);
        }
    }
});