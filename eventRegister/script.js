var cyberquest = '<option value="choose">Choose...</option>'+
            '<option value="insomnia">Insomnia</option>'+
            '<option value="webster">Webster</option>'+
            '<option value="softablitz">Softablitz</option>'+
            '<option value="softathalon">Softathalon</option>'+
            '<option value="droidrush">Droidrush</option>'+
            '<option value="operomania">Operomania</option>'+
            '<option value="codeoftheday">Code of the day</option>'+
            '<option value="sphinx">Sphinx</option>'+
            '<option value="logicalrhythm">Logical Rhythm</option>'+            
            '<option value="tuxwars">Tuxwars</option>'+
            '<option value="revengg">Revengg</option>'+
            '<option value="inception">Inception</option>';

var aerodynamix = '<option value="choose">Choose...</option>'+
            '<option value="phantom">Phantom</option>'+
            '<option value="guardian">Guardian</option>'+
            '<option value="lostinspace">Lost in Space</option>';

var electromania = '<option value="choose">Choose...</option>'+
            '<option value="circuitoftheday">Circuit of the Day</option>'+
            '<option value="combomagic">Combo Magic</option>'+
            '<option value="embeddeddesign">Embedded Design</option>'+
            '<option value="impromptu">Impromptu</option>'+
            '<option value="fpgadesignevent">FPGA Design event</option>'+
            '<option value="quintathlon">Quintathlon</option>'+
            '<option value="codotron">Codotron</option>'+
            '<option value="innodev">InnoDev</option>';

var genesis = '<option value="choose">Choose...</option>'+
            '<option value="palladin">Palladin</option>'+
            '<option value="centraldogma">Central Dogma</option>'+
            '<option value="cluequest">Clue Quest</option>';

var mechrocosm = '<option value="choose">Choose...</option>'+
            '<option value="triathlon">Triathlon</option>'+
            '<option value="thematica">Thematica</option>'+
            '<option value="scrapheap">Scrapheap</option>'+
            '<option value="survivorseries">Survivor Series</option>'+
            '<option value="blueprint">Blueprint</option>'+
            '<option value="contraption">Contraption</option>'+
            '<option value="venividivici">Veni Vidi Vici</option>'+
            '<option value="automax">Automax</option>'+
            '<option value="pumpitup">Pump It Up</option>';

var nirmaan = '<option value="choose">Choose...</option>'+
            '<option value="linkidge">Linkidge</option>'+
            '<option value="concube">Concube</option>'+
            '<option value="ziggurare">Ziggurare</option>'+
            '<option value="cognizance">Cognizance</option>'+
            '<option value="terraquiz">Terraquiz</option>';

var oligopoly = '<option value="choose">Choose...</option>'+
            '<option value="adhole">Ad-hole</option>'+
            '<option value="tradingstrategist">Trading Strategist</option>'+
            '<option value="pitchers">Pitchers</option>'+
            '<option value="sololobo">Solo-Lobo</option>';

var powersurge = '<option value="choose">Choose...</option>'+
            '<option value="predefinedhardware">Predefined Hardware</option>'+
            '<option value="pentathlon">Pentathlon</option>'+
            '<option value="circuitbizz">Circuit Bizz</option>'+
            '<option value="warofcurrents>War of Currents</option>'+
            '<option value="codesparks">CodeSparks</option>';

var rasayans = '<option value="choose">Choose...</option>'+
            '<option value="quizardium">Quizardium</option>'+
            '<option value="chemethlon">Chemethlon</option>'+
            '<option value="quimicodisenyo">Quimico Disenyo</option>'+
            '<option value="pumpit">Pump It</option>'+
            '<option value="chemq">ChemQ</option>'+
            '<option value="simulazione">Simulazione</option>';

var robomania = '<option value="choose">Choose...</option>'+
            '<option value="mindyourpath">Mind your path</option>'+
            '<option value="daksha">Daksha</option>'+
            '<option value="mindthetraffic">Mind the traffic</option>';

var monopoly = '<option value="choose">Choose...</option>'+
             '<option value="chanakyaneeti">Chanakya Neeti</option>'+
             '<option value="navachar">Navachar</option>'+
             '<option value="stallmart">Stall Mart</option>'+
             '<option value="netritva">Netritva</option>';

var kreedomania = '<option value="choose">Choose...</option>'+
            '<option value="kreedomania">Kreedomania</option>';

var gnosiomania = '<option value="choose">Choose...</option>'+
            '<option value="indiaquiz">India Quiz</option>'+
            '<option value="generalquiz">General Quiz</option>'+
            '<option value="biztechquiz">Biz-Tech Quiz</option>'+
            '<option value="melaquiz">Mela Quiz</option>'+
            '<option value="sportsquiz">Sports Quiz</option>';

var default_val = '<option value="choose">Choose...</option>';


document.getElementById('selectEvent').addEventListener('change',function(){

    setSelectBox();
});

function setSelectBox(){
    var parent = getSelectValue('selectEvent');

    var temp = document.getElementById('selectContest');
    switch(parent){
        case 'cyberquest':
            temp.innerHTML = cyberquest;
            break;
        case 'aerodynamix':
            temp.innerHTML = aerodynamix;
            break;
        case 'electromania':
            temp.innerHTML = electromania;
            break;
        case 'mechrocosm':
            temp.innerHTML = mechrocosm;
            break;
        case 'genesis':
            temp.innerHTML = genesis;
            break;
        case 'nirmaan':
            temp.innerHTML = nirmaan;
            break;
        case 'oligopoly':
            temp.innerHTML = oligopoly;
            break;
        case 'powersurge':
            temp.innerHTML = powersurge;
            break;
        case 'rasayans':
            temp.innerHTML = rasayans;
            break;
        case 'robomania':
            temp.innerHTML = robomania;
            break;
        case 'monopoly':
            temp.innerHTML = monopoly;
            break;
        case 'kreedomania':
            temp.innerHTML = kreedomania;
            break;
        case 'gnosiomania':
            temp.innerHTML = gnosiomania;
            break;
        default:
            temp.innerHTML = default_val;
    }
}

function getSelectValue(id){
    var x = document.getElementById(id).selectedIndex;
    var parent = document.getElementsByTagName("option")[x].value;
    return parent;
}

function getTeams(tokenId){

    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST','https://avishkarapi.sahajbamba.me/auth/getuserdetails/',true);
    xhr.setRequestHeader('authorization',tokenId);

    xhr.onload = function(){

        var json = JSON.parse(this.response);
        if(json.success == true){
            getTeamsUtil(JSON.parse(this.response));
        }
        else{
            swal({
                title: "Error!",
                text: ""+json.errors,
                icon: "error",
                button: "close",
            });
        }
    };

    xhr.send(data);
}

function getTeamsUtil(teamsObj){

    var username = teamsObj.userName;
    var selectTeam = '<option value="choose">Choose...</option>';
    var obj = teamsObj.teams;
    for(var key in obj){
        if(obj[key].teamAdmin == username)
        selectTeam = selectTeam+'<option value="'+key+'">'+obj[key].teamName+' - '+key+'</option>';
    }
    document.getElementById('selectTeam').innerHTML = selectTeam;
}



document.getElementById('selectEvent').addEventListener('change',function(){
    var tmp = document.getElementById('errorEvent').innerHTML;
    if(tmp != '')
        adjustHeight(false);
    document.getElementById('errorEvent').innerHTML = null;
});

document.getElementById('selectContest').addEventListener('change',function(){
    var tmp = document.getElementById('errorContest').innerHTML;
    if(tmp != '')
        adjustHeight(false);
    document.getElementById('errorContest').innerHTML = null;
});

document.getElementById('selectTeam').addEventListener('change',function(){
    var tmp = document.getElementById('errorTeam').innerHTML;
    if(tmp != '')
        adjustHeight(false);
    document.getElementById('errorTeam').innerHTML = null;
});

document.querySelector('#submitBtn').addEventListener('click', function () {

    var events = getSelectValue('selectEvent');
    var contests = document.getElementById('selectContest').value;
    var teams = document.getElementById('selectTeam').value;

    console.log(events+" "+contests+" "+teams);
    // If user is not logged in, redirect to login page.

    /*tokenId = localStorage.getItem('authtoken');
    if(tokenId == null){
        //Redirect to Login Page
    }
    */

    var flag = true;

    if (events == 'choose') {
        flag = false;
        adjustHeight(true);
        document.getElementById('errorEvent').innerHTML = '<small style="color: red;">* Please select a valid event.</small>';
    }
    if (contests == 'choose') {
        flag = false;
        adjustHeight(true);
        document.getElementById('errorContest').innerHTML = '<small style="color: red;">* Please select a valid contest.</small>';
    }
    if (teams == 'choose') {
        flag = false;
        adjustHeight(true);
        document.getElementById('errorTeam').innerHTML = '<small style="color: red;">* Please select a valid team.</small>';
    }

    if (flag) {
        eventRegister(tokenId,teams,contests);
    }

});


function eventRegister(tokenId, teamId, eventId) {

    var data = new FormData();
    data.append("teamid", teamId);
    data.append("eventid",eventId);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', 'https://avishkarapi.sahajbamba.me/event/registertoevent/', false);
    xhr.setRequestHeader('authorization', tokenId);
    //xhr.setRequestHeader('cache-control', 'no-cache');
    //xhr.setRequestHeader("postman-token", "ae3469f2-dc36-da01-4647-8f8b00888d5d");

    xhr.onload = function () {
        
        var json = JSON.parse(this.response);
        if (json.success == true) {

            swal({
                title: "Registered!",
                text: "You have successfully registered to the "+eventId,
                icon: "success",
                button: "close",
            });
        }
        else{
            swal({
                title: "Unsuccessful!",
                text: ""+json.errors,
                icon: "error",
                button: "close",
            });
        }
    }

    xhr.send(data);
}

function adjustHeight(op){
    var tmp = parseInt(document.getElementById('section').style.height.substr(0,3));
    if(op == true)
        tmp += 24;
    else
        tmp -= 24;
    
    document.getElementById('section').style.height = tmp+"px";
}

var tokenId = 'Token '+localStorage.getItem('authtoken');
getTeams(tokenId);


