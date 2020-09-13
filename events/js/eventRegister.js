let authtoken;                      
let userDetails;
let createdTeams = [];
let registeredEvents = [];
let eventID = undefined;
// to download csv
let isStaff = false;

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
                } else {
                    let username = userDetails.userName;

                    // to download csv
                    if (data['isStaff']) {
                        isStaff = true;
                        $('.download-list').show();
                    }

                    for (let key in userDetails.teams) {
                        if (userDetails.teams.hasOwnProperty(key)) {
                            let value = userDetails.teams[key];
                            if (username === value.teamAdmin) {
                                createdTeams.push([value.teamName, value.teamID]);
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
            }).catch((error) => {
                disableButton();
                console.log("Error in getting user details"+ error);
            });




    }

    // to download csv
    $('.download-list').on('click', function (e) {
        if (!isStaff || authtoken == null) return;
        let eventid = $(this).attr('data-event-id');
        console.log(authtoken + " " + eventid);
        getRegisteredStudents(authtoken, eventid).then((obj) => {
            console.log(obj);
            if (!obj['success']) {
                alert('Some Error Occured');
                return;
            }
            let teams = [];
            for (let team of obj['teams']) {
                for (let student of team['team_members']) {
                    let temp = {};
                    temp['team_admin'] = team['team_admin'];
                    temp['team_id'] = team['team_id'];
                    //temp['team_size'] = team['team_size'];
                    temp['username'] = student['userName'];
                    temp['email'] = student['email'];
                    temp['firstName'] = student['firstName'];
                    temp['lastName'] = student['lastName'];
                    temp['confirmed'] = student['confirmed'];
                    temp['feesPaid'] = student['feesPaid'];
                    temp['whatsapp'] = student['whatsapp'];
                    temp['phone'] = student['phone'];
                    temp['college'] = student['college'];
                    temp['resume'] = student['resume'];
                    temp['msteamsID'] = student['msteamsID'];
                    teams.push(temp);
                }
            }
            console.log(teams);
            let headers = ['team_id','team_admin','username','email','firstName','lastName','confirmed','feesPaid','whatsapp','phone','college','resume','msteamsID'];
            JSONToCSVConvertor(teams, "Registered_Students", true,headers);
        });
    });
});

// to download csv
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel,headers) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index of headers) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function registerForEvent(event) {
    console.log(event.target.id);
    eventID = event.target.id.substring(0, event.target.id.indexOf('Button'));
    console.log(eventID);

    if(createdTeams.length === 0){
        toastr.error('Create team to register for event','Error!', {
            closeButton: true
        });
        return; 
    }                       
    for (let i = 0; i < registeredEvents.length; i++) {
        if (registeredEvents[i] === eventID) {
            toastr.error('Already Registered for the Event','Error!', {
                closeButton: true
            });
            return;                             // add toast of already registered
        }
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

function disableButton() { //add all button to disable
    if(document.getElementById("insomniaButtonId"))
        document.getElementById("insomniaButtonId").disabled = true;
    
}

function registerAfterSelectingTeam(event) {
    select = document.getElementById('teamDropdownMenu');
    console.log(select.options[select.selectedIndex].value);
    let teamID = select.options[select.selectedIndex].value;
    $('#selectTeamModal').modal('hide');
    apiCallRegisterEvent(teamID)
        .then(result => {
            if (result['success']) {
                console.log(result['success']);
                toastr.success('Successfully Registered for the Event','Success!',{
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
    if(!button)return;
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
async function apiCallRegisterEvent(teamID) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

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

async function getRegisteredStudents(authtoken, eventid) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

    var formdata = new FormData();
    formdata.append('eventid', eventid);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    let response = await fetch("https://avishkarapi.sahajbamba.me/event/getregistereduserslistofevent/", requestOptions);
    return response.json();
}