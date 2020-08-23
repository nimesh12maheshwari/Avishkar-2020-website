window.onload = getUserDetails();
var pendingRequest = [];
var teamID = undefined;

function initialize(userDetails) {
	const userName = userDetails.userName;
	var count = 0;
	var token = null;

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

	if (token === null) {
		var childNodes = document.getElementById("login");
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
				alert(error);
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
		option.classList.add("font-weight-bolder");
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
	teamID = event.target.id;
}

function acceptRequest() {
	console.log(teamID);
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
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	
		$('#exampleModal').modal('hide');
		location.reload();
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
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

		$('#exampleModal').modal('hide');
		location.reload();
}

function logout(){
	localStorage.removeItem("authtoken");
	window.location = "../index.html";
}