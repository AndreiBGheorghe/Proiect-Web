function setCookie(nume, val, timpExpirare){
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";")
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

function deleteAllCookies(){
    document.cookie=`${"acceptat_banner"}=0; expires=${(new Date()).toUTCString()}`;
    document.cookie=`${"ultima_pagina"}=0; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("cookies").style.display="none";
        document.getElementById("bannercookie").style.display="none";
    }
    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,6000);
        document.getElementById("cookies").style.display="none";
        document.getElementById("bannercookie").style.display="none";
    }
    const currentUrl = window.location.href;
    setCookie("ultima_pagina", currentUrl,6000);
    const ultimaPagina = getCookie("ultima_pagina");
    if (ultimaPagina) {
        document.getElementById("ultimapag").textContent = ultimaPagina;
    }
})