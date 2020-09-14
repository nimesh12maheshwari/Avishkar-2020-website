'use strict';
let authtoken;
let userDetails;
let accordionIndex = 1;
let currentTeamSelected;
let removeMemberTeamId;
let removeMemberUsername;

toastr.options = {
    "positionClass": "toast-bottom-right",
    maxOpened: 1,
    autoDismiss: true,
}
$(document).ready(function () {
    //localStorage.setItem('authtoken', '1ccd67221b3cb291a978bf8259baf482c6ef89ba'); // to remove later on
    authtoken = localStorage.getItem('authtoken');
    if (authtoken == null) {
        showLoginPrompt();
    } else {
        fillAccordion();
        $('#send-create-team-request').on('click', (e) => {
            createTeamBtnClicked();
        });
        $('#create-team').on('click', (e) => {
            $('#modal-alert-create-team').hide();
            $('#modal-create-team').modal('show');
        });

        $('#send-request').on('click', function (e) {
            sendRequestBtnClicked();
        });

        $('body').on('click', '.remove-member', function (e) {
            removeMemberTeamId = $(this).data('teamId');
            removeMemberUsername = $(this).data('username');
            $('#modal-remove-member').modal({
                backdrop: "static",
                keyboard: false
            });
        });
        $('#remove-member-confirm').on('click', (e) => {
            $('#modal-remove-member').modal('hide');
            sendRemoveMemberRequest(removeMemberTeamId, removeMemberUsername)
                .then((data) => {
                    // console.log(data);
                    if (data['success'] == true) {
                        fillAccordion();
                    } else {
                        toastr.error(data['errors'][0]);
                    }
                }).catch(() => {
                    toastr.error('Unable to remove Member');
                });
        });

    }
});
function showNoTeamPrompt() {
    $('#prompt-no-team').show();
}
function hideNoTeamPrompt() {
    $('#prompt-no-team').hide();
}
function showLoginPrompt() {
    $('.main').hide();
    $('#prompt-login').show();
}

function fillAccordion() {
    $('#accordion').empty();
    accordionIndex = 1;
    getUserDetails()
        .then(data => {
            userDetails = data;
            // console.log(data);
            if (data['detail'] == 'Invalid token.') {
                showLoginPrompt();
            } else {
                if(Object.keys(data.teams).length == 0)
                    showNoTeamPrompt();
                else
                    populatePage(data);
            }
        })
        .catch(() => {
            toastr.warning("Error in getting user details");
        });
}

function populatePage(data) {
    $.each(data['teams'], (key, team) => {
        let card = makeAccordionCard(team, accordionIndex);
        addAccordionCard(card, team);
    });
}

function addAccordionCard(card, team) {
    card.data('team', team);
    $('#accordion').append(card);
    $(`#collapse${accordionIndex} .add-member`).on('click', (e) => {
        // console.log(team);
        currentTeamSelected = team;
        $('#modal-alert-add-member').hide();
        $('#modal-add-member').modal('show');
    });
    accordionIndex++;
}

function makeAccordionCard(team, index) {
    let card = $('<div>').addClass('card');
    let cardHeader = makeAccordionHeader(team['teamID'], team['teamName'], index);
    let cardBody = makeAccordionBody(team, index);
    card.append([cardHeader, cardBody]);
    return card;
}

function makeAccordionHeader(teamID, teamName, index) {
    let cardHeader = $('<div>', {
        'class': 'card-header collapsed',
        'id': 'heading' + index.toString(),
        'data-toggle': 'collapse',
        'data-target': '#collapse' + index.toString()
    });
    // let h5 = $('<h5>', {
    //     'class': 'mb-0'
    // });
    let a = $('<span>').text(index + ".   " + teamName + " - " + teamID);

    // h5.append(button);
    cardHeader.append(a);
    return cardHeader;
}

function makeAccordionBody(team, index) {
    let body = $('<div>', {
        'id': 'collapse' + index.toString(),
        'class': 'collapse',
        'data-parent': '#accordion'
    });
    let cardBody = $('<div>', {
        'class': 'card-body'
    });

    let registeredEvents = makeRegisteredEventsBody(team, index);

    let teamTable = makeTeamTable(team, index);
    let spanBtn = $('<span>', {
        'class': 'd-inline-block',
        'tabindex': '0',
        'data-toggle': 'tooltip',
        'title': 'Add a Member',
        'data-placement': 'right'
    });
    let addMemberBtn = $('<a>', {
        'class': 'add-member neon-btn'
    });
    addMemberBtn.append([$('<span>'), $('<span>'), $('<span>'), $('<span>')]);
    addMemberBtn.append($('<u>Add Member</u>'));
    spanBtn.append(addMemberBtn);
    cardBody.append([registeredEvents, spanBtn, teamTable]);
    body.append(cardBody);

    return body;
}

function makeRegisteredEventsBody(team, index) {
    if (Object.keys(team['registeredEvents']).length == 0) {
        let h5 = $('<h5>').text('No Events are registered for this team');
        return h5;
    }
    let wrapper = $('<div>', {
        'class': 'registered-events-wrapper',
        'id': 'registered-events-wrapper' + index.toString()
    });
    let h5 = $('<h5>').text('Registered Events');
    let table = $('<table>', {
        'class': 'table'
    }).append(makeRegisteredEventsTableHeader());
    let tableBody = makeRegisteredEventsTableBody(team);
    table.append(tableBody);
    wrapper.append([h5, table]);
    return wrapper;
}

function makeRegisteredEventsTableBody(team) {
    let tbody = $('<tbody>');
    let rowIndex = 1;
    $.each(team['registeredEvents'], (key, val) => {
        let tr = $('<tr>').append($('<th>', {
            'scope': 'row'
        }).text(rowIndex));
        tr.append($('<td>').text(val['eventName']));
        tbody.append(tr);
        rowIndex++;
    });
    return tbody;
}

function makeTeamTable(team, index) {

    let tableWrapper = $('<div>', {
        'class': 'table-wrapper',
        'id': 'table-wrapper-' + index.toString()
    });

    let table = $('<table>', {
        'class': 'table'
    });
    table.append(makeTableHeader());
    table.append(makeTableBody(team));
    tableWrapper.append(table);
    return tableWrapper;
}

function makeRegisteredEventsTableHeader() {
    let tableHeader = $('<thead>');
    let tr = $('<tr>').append($('<th>', {
            'scope': 'col'
        }).text('#'))
        .append($('<th>', {
            'scope': 'col'
        }).text('Event Name'));
    tableHeader.append(tr);
    return tableHeader;
}

function makeTableHeader(first = 'Username', second = 'Status') {
    let tableHeader = $('<thead>');
    let tr = $('<tr>').append($('<th>', {
            'scope': 'col'
        }).text('#'))
        .append($('<th>', {
            'scope': 'col'
        }).text(first))
        .append($('<th>', {
            'scope': 'col'
        }).text(second))
        .append($('<th>').text('Options'));
    tableHeader.append(tr);
    return tableHeader;
}

function makeTableBody(team) {
    let teamAdmin = team['teamAdmin'];
    let teamMembers = team['teamMembers'];
    let pendingMembers = team['pendingMembers'];
    let teamId = team['teamID'];
    let tbody = $('<tbody>');
    let rowIndex = 1;
    $.each(teamMembers, (index, val) => {
        let tr;
        if (val === teamAdmin) {
            tr = makeNewRow(rowIndex, val, 'Admin', teamId);
        } else {
            tr = makeNewRow(rowIndex, val, 'Member', teamId);
        }
        rowIndex++;
        tbody.append(tr);
    });

    $.each(pendingMembers, (index, val) => {
        let tr = makeNewRow(rowIndex, val, 'Pending', teamId);
        rowIndex++;
        tbody.append(tr);
    });
    return tbody;
}

function makeNewRow(rowIndex, username, status, teamId) {
    let threeDots = $(`<div class="dropdown"><button class="options-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg></button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item remove-member" href="#">Remove Member</a>
    </div>
  </div>`);

    let tr = $('<tr>').append($('<th>', {
        'scope': 'row'
    }).text(rowIndex));
    let tdUsername = $('<td>').text(username);
    let tdStatus = $('<td>');
    let spanBadge;
    if (status == 'Admin') {
        spanBadge = $('<span>', {
            'class': 'badge badge-primary'
        }).text(status);
    } else if (status === "Member") {
        spanBadge = $('<span>', {
            'class': 'badge badge-success'
        }).text(status);
    } else {
        spanBadge = $('<span>', {
            'class': 'badge badge-danger'
        }).text(status);
    }
    tdStatus.append(spanBadge);
    let dots = threeDots.clone();
    dots.addClass('team-table-dots').attr('id', 'team-table-dots-' + rowIndex.toString());
    dots.find('.remove-member').data('teamId', teamId);
    dots.find('.remove-member').data('username', username);
    // dots.find('.remove-member').on('click', (e) => {
    //     e.preventDefault();
    //     $('#modal-remove-member').modal({
    //         backdrop: 'static',
    //         keyboard: false
    //     }).on('click', '#remove-member-confirm', (e) => {
    //         console.log('click');
    //         sendRemoveMemberRequest(teamId, username)
    //             .then((data) => {
    //                 console.log(data);
    //                 if (data['success'] == true) {
    //                     fillAccordion();
    //                 } else {
    //                     toastr.error(data['errors'][0]);
    //                 }
    //             }).catch(() => {
    //                 toastr.error('Unable to remove Member');
    //             });
    //         $('#remove-member-cancel').click();
    //         return true;
    //     })

    // });
    let dotsTd = $('<td>').append(dots);
    tr.append([tdUsername, tdStatus, dotsTd]);

    rowIndex++;
    return tr;
}

function createTeamBtnClicked() {
    let teamName = $('#team-name').val();
    if (teamNameValidate()) {
        sendCreateTeamRequest(teamName).then((data) => {
            // console.log(data);
            if (data['success']) {
                $('#modal-create-team').modal('hide');
                hideNoTeamPrompt();
                toastr.success('Team Created');

                let team = {
                    teamName: teamName,
                    teamAdmin: userDetails['userName'],
                    teamID: data['team_id'],
                    teamMembers: [userDetails['userName']],
                    pendingMembers: [],
                    registeredEvents: {}
                };
                let card = makeAccordionCard(team, accordionIndex);
                addAccordionCard(card, team);
            } else {
                // toastr.warning(data['errors'][0]);
                $('#modal-alert-create-team').text(data['errors'][0]);
                $('#modal-alert-create-team').show();
            }

        }).catch(() => {
            $('#modal-create-team').modal('hide');
            toastr.error('Error in creating team');
        });
    } else {
        $('#modal-alert-create-team').text('Team name should be of length more than 5 and should contain lowercase characters');
        $('#modal-alert-create-team').show();
    }
}

function sendRequestBtnClicked() {
    let username = $('#username').val();
    if (usernameValidate()) {
        sendAddMemberRequest(currentTeamSelected['teamID'], username).then((data) => {
            // console.log(data);
            if (data['success']) {
                $('#modal-add-member').modal('hide');
                toastr.success('Request Sent');
                fillAccordion();
            } else {
                // toastr.error(data['errors'][0]);
                $('#modal-alert-add-member').text(data['errors'][0]);
                $('#modal-alert-add-member').show();
            }
        }).catch(() => {
            $('#modal-add-member').modal('hide');
            toastr.error('Unable to send request');
        });
    } else {
        $('#modal-alert-add-member').text("Name should be of length more than 5 and should contain lowercase characters or '_' or numbers");
        $('#modal-alert-add-member').show();
    }

}

function teamNameValidate() {
    /*let teamName = $('#team-name').val();
    if (teamName == null || typeof teamName != 'string' || teamName.length < 6 || teamName.length > 255) return false;
    for (let c of teamName) {
        if (!isNaN(c * 1)) {
            return false;
        }
        if (c == c.toUpperCase())
            return false;
    }*/
    return true;
}

function usernameValidate() {
    let username = $('#username').val();
    // console.log(username);
    if (username == null || typeof username != 'string' || username.length < 6 || username.length > 255) return false;
    //if(!isNaN(username[0]*1)) return false;
    for (let c of username) {
        if (c === '_') continue;
        //username can be a number
        if (!isNaN(c * 1)) {
            continue;
        }
        if (c == c.toUpperCase())
            return false;
    }
    return true;
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

async function sendCreateTeamRequest(teamname) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

    var formdata = new FormData();
    formdata.append('teamname', teamname);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    let response = await fetch("https://avishkarapi.sahajbamba.me/event/createteam/", requestOptions);
    return response.json();
}

async function sendAddMemberRequest(teamid, username) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

    var formdata = new FormData();
    formdata.append('teamid', teamid);
    formdata.append('memberusername', username);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    let response = await fetch("https://avishkarapi.sahajbamba.me/event/addteammember/", requestOptions);
    return response.json();
}

async function sendRemoveMemberRequest(teamid, username) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authtoken);

    var formdata = new FormData();
    formdata.append('teamid', teamid);
    formdata.append('memberusername', username);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    let response = await fetch("https://avishkarapi.sahajbamba.me/event/removeteammember/", requestOptions);
    return response.json();
}