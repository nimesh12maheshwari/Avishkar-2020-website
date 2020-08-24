/*tokenId = localStorage.getItem('authtoken');
    if(tokenId == null){
        //Redirect to Login Page
    }
    */
var tokenId = 'Token ' + 'ca8359c8a39a74803f8576ac9b9c449319a84e63'; //+localStorage.getItem('authtoken').toString();
var details = getUserDetails(tokenId);


function getUserDetails(tokenId) {

    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', 'https://avishkarapi.sahajbamba.me/auth/getuserdetails/', true);
    xhr.setRequestHeader('authorization', tokenId);

    xhr.onload = function () {
        details = JSON.parse(this.response);
        if (details.success == true) {
            return setAllFields(details);
        }
        else{
            swal({
                title: "Error!",
                text: ""+details.errors,
                icon: "error",
                button: "close",
            });
        }
    }
    xhr.send(data);
}


function setAllFields(details) {

    document.getElementById('usernameProfile').value = details.userName;
    document.getElementById('fnameProfile').value = details.firstName;
    document.getElementById('lnameProfile').value = details.lastName;
    if (details.college == 'MNNIT')
        document.getElementById('collegeProfile').readOnly = true;
    document.getElementById('collegeProfile').value = details.college;
    document.getElementById('resumeProfile').value = details.resume;
    document.getElementById('emailProfile').value = details.email;
    document.getElementById('msteamidProfile').value = details.msteamsID;
    document.getElementById('phonenoProfile').value = details.phone;
    document.getElementById('whatsappnoProfile').value = details.whatsapp;

    return details;
}


function updateOtherDetails(details, tokenId) {

    var college = document.getElementById('collegeProfile').value;
    var msteamid = document.getElementById('msteamidProfile').value;
    var phone = document.getElementById('phonenoProfile').value;
    var whatsapp = document.getElementById('whatsappnoProfile').value;
    var resume = document.getElementById('resumeProfile').value;

    if(college == 'MNNIT')
        college = '';

    var flag = true;

    if ((college != details.college) || (msteamid != details.msteamsID) || (phone != details.phone) || (whatsapp != details.whatsapp) || (resume != details.resume)) {

        
        var data = new FormData();
        data.append('college', college.toString());
        data.append('phone', phone.toString());
        data.append('whatsapp', whatsapp.toString());
        data.append('msteams', msteamid);
        data.append('resume', resume);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.open("POST", "https://avishkarapi.sahajbamba.me/auth/updatecontact/", false);
        xhr.setRequestHeader("authorization", tokenId);

        xhr.onload = function () {
            var tmp = JSON.parse(this.response);
            console.log(tmp);
            if (tmp.success == true) {
                flag = true;
            }
            else{
                swal({
                    title: "Error!",
                    text: ""+tmp.errors,
                    icon: "error",
                    button: "close",
                });
                console.log('UpdateOtherDetails');
                flag = false;
            }
        };

        xhr.send(data);
    }
    if(flag)
    return true;
    return false;
}


function updateNameEmail(details, tokenId) {

    var fname = document.getElementById('fnameProfile').value;
    var lname = document.getElementById('lnameProfile').value;
    var email = document.getElementById('emailProfile').value;

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
            console.log(tmp)
            if (tmp.success == true) {
                flag = true;
            }
            else{
                swal({
                    title: "Error!",
                    text: ""+tmp.errors,
                    icon: "error",
                    button: "close",
                });
                console.log('UpdateName');
                flag = false;
            }
        };
        xhr.send(data);
    }
    if(flag)
    return true;
    return false;
}

document.getElementById('saveBtn').addEventListener('click', function () {

    console.log(details);
    var flag1 = true;
    var flag2 = true;

    flag1 = updateNameEmail(details, tokenId);
    if(flag1 == true)
        flag2 = updateOtherDetails(details, tokenId)

        console.log(flag1 + " "+flag2 );
    if(flag1 && flag2){
        swal({
            title: "Success!",
            text: "All changes are successfully saved.",
            icon: "success",
            button: "close",
        });
    }
    
});

document.querySelector('.container').addEventListener('input',function(){
    document.getElementById('saveBtn').disabled = false;
});
