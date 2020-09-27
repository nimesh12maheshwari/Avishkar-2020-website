var tokenId;
var details;
var isLocked = false;
init();

function init() {
    var token = localStorage.getItem('authtoken');
    if (token == null) {
        document.getElementById('prompt-login').style.display = "block";
    }
    else {
        tokenId = 'Token ' + token.toString();
        details = getUserDetails(tokenId);
    }
}

function getUserDetails(tokenId) {

    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', 'https://avishkarapi.sahajbamba.me/auth/getuserdetails/', true);
    xhr.setRequestHeader('authorization', tokenId);

    xhr.onload = function () {
        details = JSON.parse(this.response);
        if (details.success == true) {
            setAllFields(details);
            document.getElementById('profile').style.display = "block";
        }
        else {
            document.getElementById('prompt-login').style.display = "block";
            // swal({
            //     title: "Error!",
            //     text: "" + details.errors,
            //     icon: "error",
            //     button: "close",
            // });
        }
    }
    xhr.send(data);
}

function setInfoAlert(details) {

    var str1 = 'not paid.';
    var str2 = 'not locked';
    if (details.confirmed)
        str2 = 'locked';
    if (details.feesPaid)
        str1 = 'paid';

    document.getElementById('alertProfile').style.display = "block";
    document.getElementById('infoProfile').innerHTML = 'Your fee is <strong>' + str1 + '</strong>.' +
        ' Your profile is <strong>' + str2 + '</strong>.' + ' Fill "NA" in fields which is not applicable.';
}

function setAllFields(details) {

    if (details.confirmed) {

        var fields = ['fnameProfile', 'lnameProfile', 'emailProfile', 'regnoProfile', 'collegeProfile', 'usernameProfile']

        for(i=0; i<fields.length; i++){
            document.getElementById(fields[i]).readOnly = true;
            document.getElementById(fields[i]).style.background = "transparent";
            document.getElementById(fields[i]).style.border = "none";
            document.getElementById(fields[i]).style.color = "white";
            document.getElementById(fields[i]).style.outline = "none";
        }
        
        document.getElementById('lockBtn').disabled = true;
        document.getElementById('lockBtn').value = 'Profile Locked';
        $('#lockBtn').removeClass('btn-primary').addClass('btn-secondary');
        isLocked = true;
    }

    document.getElementById('usernameProfile').value = details.userName;
    document.getElementById('fnameProfile').value = details.firstName;
    document.getElementById('lnameProfile').value = details.lastName;
    if (details.college == 'MNNIT')
        document.getElementById('collegeProfile').readOnly = true;
    document.getElementById('collegeProfile').value = details.college;
    document.getElementById('resumeProfile').value = details.resume;
    document.getElementById('emailProfile').value = details.email;
    document.getElementById('regnoProfile').value = details.regno;
    document.getElementById('msteamidProfile').value = details.msteamsID;
    document.getElementById('phonenoProfile').value = details.phone;
    document.getElementById('whatsappnoProfile').value = details.whatsapp;

    setInfoAlert(details);
    var cnt = 1;
    let table = createTable();
    let thead = createHead(['#', 'Event', 'Team Name', 'Team Id']);
    let tbody = document.createElement("tbody");
    let teams = details.teams;

    for (var teamId in teams) {

        let events = teams[teamId].registeredEvents;
        var teamName = teams[teamId].teamName;

        for (var eventId in events) {

            var eventName = events[eventId].eventName;
            let tr = createRows([cnt.toString(), eventName, teamName, teamId]);
            tbody.appendChild(tr);
            cnt++;
        }
    }

    console.log(cnt);
    if (cnt > 1) {
        table.appendChild(thead);
        table.appendChild(tbody);
        document.getElementById('eventList').appendChild(table);
    }
    else {
        let hr = document.createElement("hr");
        let span = document.createElement("span");
        span.appendChild(document.createTextNode("You have not registered for any event yet."));
        document.getElementById('eventList').appendChild(hr);
        document.getElementById('eventList').appendChild(span);
    }
    return details;
}

function createTable() {

    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped mt-3");
    table.style.wordWrap = 'break-word';
    table.style.wordBreak = 'break-word';
    return table;
}

function createHead(fields) {

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    for (var i = 0; i < fields.length; i++) {
        let th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.appendChild(document.createTextNode(fields[i]));

        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead;
}

function createRows(fields) {

    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(fields[0]));
    tr.appendChild(th);

    for (var i = 1; i < fields.length; i++) {
        let td = document.createElement("td");
        td.style.maxWidth = '250px';
        td.appendChild(document.createTextNode(fields[i]));
        tr.appendChild(td);
    }
    return tr;
}

function updateOtherDetails(details, tokenId) {

    var college = document.getElementById('collegeProfile').value.trim();
    var msteamid = document.getElementById('msteamidProfile').value.trim();
    var phone = document.getElementById('phonenoProfile').value.trim();
    var whatsapp = document.getElementById('whatsappnoProfile').value.trim();
    var resume = document.getElementById('resumeProfile').value.trim();
    var regno = document.getElementById('regnoProfile').value.trim();
    var flag = true;

    if (college == 'MNNIT' && ((regno == 'NA') || (regno == '') )) {
        swal({
            title: "Error!",
            text: "Invalid Registration Number. MNNITians are required to fill their valid Registration Number.",
            icon: "error",
            button: "close",
        });
        return false;
    }

    if ((college != details.college) || (msteamid != details.msteamsID) || (phone != details.phone) || (whatsapp != details.whatsapp) || (resume != details.resume) || (regno != details.regno)) {

        if (college == 'MNNIT')
            college = '';

        if (phone == '' || phone.length < 10) {
            swal({
                title: "Error!",
                text: "Invalid Phone Number",
                icon: "error",
                button: "close",
            });
            flag = false;
        }

        if (whatsapp == '' || whatsapp.length < 10) {
            swal({
                title: "Error!",
                text: "Invalid Whatsapp Number",
                icon: "error",
                button: "close",
            });
            flag = false;
        }

        if (flag) {
            var data = new FormData();
            data.append('college', college.toString());
            data.append('phone', phone.toString());
            data.append('whatsapp', whatsapp.toString());
            data.append('msteams', msteamid);
            data.append('resume', resume);
            data.append("regno", regno);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.open("POST", "https://avishkarapi.sahajbamba.me/auth/updatecontact/", false);
            xhr.setRequestHeader("authorization", tokenId);

            xhr.onload = function () {
                var tmp = JSON.parse(this.response);
                toastr.remove();
                if (tmp.success == true) {
                    flag = true;
                }
                else {
                    swal({
                        title: "Error!",
                        text: "" + tmp.errors,
                        icon: "error",
                        button: "close",
                    });
                    flag = false;
                }
            };

            xhr.send(data);
        }
    }
    if (flag)
        return true;
    return false;
}


function updateNameEmail(details, tokenId) {

    var fname = document.getElementById('fnameProfile').value.trim();
    var lname = document.getElementById('lnameProfile').value.trim();
    var email = document.getElementById('emailProfile').value.trim();

    var flag = true;

    if ((fname != details.firstName) || (lname != details.lastName) || (email != details.email)) {

        var data = new FormData();
        data.append('fname', fname);
        data.append('lname', lname);
        data.append('email', email);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.open('POST', 'https://avishkarapi.sahajbamba.me/auth/updatenameandemail/', false);
        xhr.setRequestHeader('authorization', tokenId);

        xhr.onload = function () {
            var tmp = JSON.parse(this.response);
            toastr.remove();
            if (tmp.success == true) {
                flag = true;
            }
            else {
                swal({
                    title: "Error!",
                    text: "" + tmp.errors,
                    icon: "error",
                    button: "close",
                });
                flag = false;
            }
        };
        xhr.send(data);
    }
    if (flag)
        return true;
    return false;
}

function lockProfile(tokenId) {

    var flag = false;
    var data = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', 'https://avishkarapi.sahajbamba.me/auth/lock/', false);
    xhr.setRequestHeader('authorization', tokenId);

    xhr.onload = function () {
        var tmp = JSON.parse(this.response);
        console.log(tmp);
        toastr.remove();
        if (tmp.success == true) {
            flag = true;
        }
        else {
            swal({
                title: "Error!",
                text: "" + tmp.errors,
                icon: "error",
                button: "close",
            });
            flag = false;
        }
    };
    xhr.send(data);
    return flag;
}

function updatePassword(tokenId) {

    var newPassword = document.getElementById('newPasswordProfile').value.trim();
    var confPassword = document.getElementById('confPasswordProfile').value.trim();
    var flag = false;
    if (newPassword == '' || confPassword == '') {
        swal({
            title: "Error!",
            text: "All fields are mandatory. Please fill all required fields.",
            icon: "error",
            button: "close",
        });
        return flag;
    }

    if (newPassword !== confPassword) {
        swal({
            title: "Error!",
            text: "New Password and Confirm Password are not same.",
            icon: "error",
            button: "close",
        });
        return flag;
    }

    var data = new FormData();
    data.append("password", newPassword);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "https://avishkarapi.sahajbamba.me/auth/changepassword/", false);
    xhr.setRequestHeader("authorization", tokenId);

    xhr.onload = function () {
        var tmp = JSON.parse(this.response);
        toastr.remove();
        if (tmp.success == true) {
            flag = true;
        }
        else {
            swal({
                title: "Error!",
                text: "" + tmp.errors,
                icon: "error",
                button: "close",
            });
            flag = false;
        }
    };

    xhr.send(data);
    return flag;
}

document.getElementById('saveBtn').addEventListener('click', function () {

    var flag = true;
    let activeTab = $('.listTab .active').text();
    console.log($('.listTab .active').text());
    toastr.warning('Waiting for response!  .....  ', '', { timeOut: 0, extendedTimeOut: 0 });
    if (activeTab === 'About') {
        flag = updateNameEmail(details, tokenId);
    }
    else if (activeTab === 'Contact') {
        flag = updateOtherDetails(details, tokenId);
    }
    else {
        flag = updatePassword(tokenId);
    }

    if (flag) {
        swal({
            title: "Success!",
            text: "All changes are successfully saved.",
            icon: "success",
            button: "close",
        }).then((value) => {
            document.getElementById('saveBtn').disabled = true;
        });
    }

});

document.querySelector('.profileSection').addEventListener('input', function () {
    document.getElementById('saveBtn').disabled = false;
});

document.getElementById('lockBtn').addEventListener('click', function () {

    var flag = false;

    swal({
        title: "Are you sure?",
        text: "Once locked, you will not be able to update your details except contact No, MSTeam Id and Resume.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                toastr.warning('Waiting for response!  .....  ', '', { timeOut: 0, extendedTimeOut: 0 });
                flag = lockProfile(tokenId);
                if (flag) {

                    swal({
                        title: "Success!",
                        text: "Your Profile has been successfully locked.",
                        icon: "success",
                        button: "close",
                    }).then((value) => {
                        location.reload();
                    });
                }
            }
        });
});
