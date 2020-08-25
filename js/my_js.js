// Validating Empty Field
// function check_empty() {
//     if (document.getElementById('name').value == "" || document.getElementById('email').value == "" || document.getElementById('msg').value == "") {
//     alert("Fill All Fields !");
//     } else {
//     document.getElementById('form').submit();
//     alert("Form Submitted Successfully...");
//     }
//     }
    //Function To Display Popup
    function div_show() {
        document.getElementById('container-login').style.display = "none";
        document.getElementById('abc').style.display = "block";
    }
    //Function to Hide Popup
    function div_hide(){
        document.getElementById('abc').style.display = "none";
    }