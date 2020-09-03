let authtoken;
let userDetails;
let createdTeams = [];
let registeredEvents = [];
let eventID = undefined;

$(document).ready(function () {
    
    authtoken = localStorage.getItem('authtoken');
    if (authtoken == null) {
        disableButton();
    } else {
        getUserDetails()
        .then(data => {
            userDetails = data;
            console.log(data);
            
            if (data['detail'] == 'Invalid token.') {
                console.log('Invalid token');
                disableButton();
            }
            else{
                let username = userDetails.userName;

                for(let key in userDetails.teams){
                    if(userDetails.teams.hasOwnProperty(key)){
                        let value = userDetails.teams[key];
                        if(username === value.teamAdmin){
                            createdTeams.push([value.teamName,value.teamID]);
                        }

                        for(let key in value.registeredEvents){
                            if(value.registeredEvents.hasOwnProperty(key)){
                                let registeredEventID = value.registeredEvents[key].eventID;
                                registeredEvents.push(registeredEventID);
                                console.log(registeredEventID);
                                changeStateOfButtonToRegistered(registeredEventID);
                            }
                        }
                    }
                    
                }
            } 
        })
        .catch(() => {
            disableButton();
            console.log("Error in getting user details");
        });   
    }
});

function registerForEvent(event){
    console.log(event.target.id);
    eventID = event.target.id.substring(0,event.target.id.indexOf('Button'));
    console.log(eventID);

    if(createdTeams.length === 0){
        toastr.error('Create team to register for event','Error!', {
            closeButton: true
        });
        return;                        
    }

    $('#selectTeamModal').modal('show');

    select = document.getElementById('teamDropdownMenu');
    select.innerHTML = "";
    for (const val of createdTeams) {
        var option = document.createElement("option");
        option.value = val[1];
        option.text = val[0] + " - " + val[1];
        select.appendChild(option);
    }

}

function disableButton(){                   //add all button to disable
    document.getElementById("insomniaButtonId").disabled = true;
}

function registerAfterSelectingTeam(event){
    select = document.getElementById('teamDropdownMenu');
    console.log(select.options[select.selectedIndex].value);
    let teamID = select.options[select.selectedIndex].value;
    $('#selectTeamModal').modal('hide');
    apiCallRegisterEvent(teamID)
        .then(result => {
            if (result['success']) {
                console.log(result['success']);
                toastr.success(result['success'],'Success!',{
                    closeButton: true
                });
                changeStateOfButtonToRegistered(eventID);
            } else {
                console.log(result['errors'][0]);
                toastr.error(result['errors'][0],'Error!', {
                    closeButton: true
                });
            }
        })
        .catch(error => {
            console.log(error);             
            toastr.error('Unable to send request','Error',{closeButton:true});
        });
}

function changeStateOfButtonToRegistered(eventID){                
    let button = document.getElementById(eventID + "ButtonId");
    button.disabled = true;
    button.innerText = 'Registered';
    //button.style.backgroundColor = 'green';
    //button.style.color = 'white';
}

// to send a api request to fetch user details
async function getUserDetails() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

    var formdata = new FormData();

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    let response = await fetch("https://avishkarapi.sahajbamba.me/auth/getuserdetails/", requestOptions);
    return response.json();
}

// to send api request to register for event
async function apiCallRegisterEvent(teamID){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token "+ authtoken);

    var formdata = new FormData();
    formdata.append("teamid", teamID);
    formdata.append("eventid", eventID);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    };

    return (await fetch("https://avishkarapi.sahajbamba.me/event/registertoevent/", requestOptions)).json();
    
}