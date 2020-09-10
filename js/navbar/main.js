window.onload = getUserDetails();
var pendingRequest = [];
var teamID = undefined;
var token;

function initialize(userDetails) {
	const userName = userDetails.userName;
	var count = 0;
	//token = null;

	for (let key in userDetails.teams) {
		let pendingMembers = userDetails.teams[key].pendingMembers;
		if (pendingMembers.indexOf(userName) >= 0) {
			++count;
			pendingRequest.push({
				"teamID": userDetails.teams[key].teamID,
				"teamAdmin": userDetails.teams[key].teamAdmin,
				"teamName": userDetails.teams[key].teamName
			});
		}
	}

	document.getElementById("notificationCount").textContent = count;
}

function getUserDetails() {

	token = localStorage.getItem("authtoken");

	if (token == null) {
		var childNodes = document.getElementById("login");
		if(childNodes)
			childNodes.remove();
		document.getElementById("notlogin").style.display = "block";
	}
	else {
		var myHeaders = new Headers();
		myHeaders.append(
			"Authorization",
			"Token " + token
		);

		var formdata = new FormData();

		var requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: formdata,
			redirect: "follow",
		};

		fetch(
			"https://avishkarapi.sahajbamba.me/auth/getuserdetails/",
			requestOptions
		)
			.then((response) => response.text())
			.then((result) => {
				var userDetails = JSON.parse(result);
				if (!userDetails["success"]) throw result;
				initialize(userDetails);
			})
			.catch((error) => {
				var childNodes = document.getElementById("login");
				childNodes.remove();
				document.getElementById("notlogin").style.display = "block";
				
			});
	}

}

function showPendingRequests() {
	var div = document.getElementById("pendingRequests");
	if (document.getElementById("pendingRequests").style.display === "block") {
		while (div.firstChild) {
			div.removeChild(div.lastChild);
		}
		document.getElementById("pendingRequests").style.display = "None";
		return;
	}
	if (pendingRequest.length > 0) document.getElementById("pendingRequests").style.display = "block";

	for (let i = 0; i < pendingRequest.length; i++) {
		let req = pendingRequest[i];
		var option = document.createElement("a");
		option.setAttribute('href', "#");
		option.className = "dropdown-item";
		option.classList.add("text-primary");
		option.innerText = req.teamAdmin + " has sent request\nfor team " + req.teamName;
		option.id = req.teamID;
		option.addEventListener("click", showModal);
		div.appendChild(option);
		if (i < pendingRequest.length - 1) {
			let divider = document.createElement("div");
			divider.className = "dropdown-divider";
			div.appendChild(divider);
		}
	}
}

function showModal(event) {
	$('#exampleModal').modal('show');
	showPendingRequests();
	teamID = event.target.id;
	
}

function acceptRequest() {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Token " + token);

	var formdata = new FormData();
	formdata.append("teamid", teamID);
	formdata.append("decision", "accept");

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: formdata,
		redirect: 'follow'
	};

	fetch("https://avishkarapi.sahajbamba.me/event/joinrequestdecision/", requestOptions)
		.then(response => response.text())
		.then(result => {
			$('#exampleModal').modal('hide');
			location.reload();
			console.log(result)						//to be removed later
		})
		.catch(error => {
			$('#exampleModal').modal('hide');
			console.log('error', error);			//to be removed later
		});

}

function rejectRequest() {
	console.log(teamID);
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Token " + token);

	var formdata = new FormData();
	formdata.append("teamid", teamID);
	formdata.append("decision", "reject");

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: formdata,
		redirect: 'follow'
	};

	fetch("https://avishkarapi.sahajbamba.me/event/joinrequestdecision/", requestOptions)
		.then(response => response.text())
		.then(result => {
			$('#exampleModal').modal('hide');
			location.reload();
			console.log(result)						//to be removed later
		})
		.catch(error => {
			$('#exampleModal').modal('hide');
			console.log('error', error);			//to be removed later
		});

		
}

function logout(){
	
	console.log(token);
	logoutApiCall()
	.then(result => {
		console.log(result);
		if(result['success']){
			localStorage.removeItem("authtoken");
			window.location = "../index.html";
		}
		else{
			console.log(result);
		}
	})
	.catch(error => console.log('error', error));

	//window.location = "../index.html";
}

// api call to logout
async function logoutApiCall(){
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Token "+ token);

	var formdata = new FormData();

	var requestOptions = {
	method: 'POST',
	headers: myHeaders,
	body: formdata,
	redirect: 'follow'
	};

	return (await fetch("https://avishkarapi.sahajbamba.me/auth/logout/", requestOptions)).json();
	
}