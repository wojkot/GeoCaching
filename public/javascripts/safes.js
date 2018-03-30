document.addEventListener("DOMContentLoaded", function (event) {

    $(function () {

        const _selectors = {
            mainContent: "#mainContent",
            safesList: '#safesList',
            discoversList: '#discoversList',
            authorName: '#authorName',
            safeNameId: '#safeNameId',
            safeDescriptionId: '#safeDescriptionId',
            safeLocalizationnId: '#safeLocalizationnId',
            safeView: '#safeView',
            editSafeName: '#editSafeName',
            removeSafeBtn: '#removeSafeBtn',
            editSafeBtn: '#editSafeBtn',
            toggle: '#toggle',
            acceptEditSafe: '#acceptEditSafe',
            editSafeDescription: '#editSafeDescription',
            editSafeLocalization: '#editSafeLocalization',
            editSafeLattitude: '#editSafeLattitude',
            editSafeLongitude: '#editSafeLongitude',
            prepareSafe: '#prepareSafe',
            setUserName: '#setUserName',
            setEmail: '#setEmail',
            setPassword: '#setPassword',
            repeatPassword: '#repeatPassword',
            registerInfo: '#registerInfo',
            editCancel: '#editCancel',
            signUp: '#signUp',
            safeListItem: '.safeListItem',
            safeModifyView: '#safeModifyView',
            showContent: '#showContent',
            editContent: '#editContent',
            addSafe: '#addSafe',
            info: '#info',
            logUser: '#loginBtn'
        }

        const _alerts = {
            'emptyList': 0,
            'cancelEdit': 1,
            'removeSuccess': 2,
            'removeFail': 3,
            'addSuccess': 4,
            'addFail': 5,
            'editSuccess': 6,
            'editFail': 7,
        }

        const _handlers = {

            onDocumentReady: function () {
                $.ajax({
                    url: '/load',
                    type: 'GET',
                    beforeSend: _handlers.displaySafeView()

                })
                    .then((ans) => {
                        let active = _handlers.checkIfUserIsActive(ans.loggedIn, ans.safes)
                        _handlers.appendSafesList(ans.safes)
                        _handlers.disableForbiddenActions(!active);
                        _handlers.appendDiscoversList(ans);
                        _handlers.fillSafeInformation(ans.safes[0], ans.owner.name);
                        _handlers.enableLoggedUserActions(ans.loggedIn);

                        if (ans.safes.length === 0) {
                            $(_selectors.safeView).hide();
                            _handlers.displayAlert(_alerts.emptyList)
                        }
                    })
                    .fail(function (err) {
                        console.log("Error. Cannot load safes.")
                    });

            },

            onAddSafeClick: function () {
                if ($(_selectors.editSafeName) !== "") {
                    $(_selectors.safeModifyView).hide();
                    $.ajax({
                        url: '/safe/save',
                        data: JSON.stringify({
                            safeName: $(_selectors.editSafeName).val(),
                            safeDescription: $(_selectors.editSafeDescription).val(),
                            safeLocalization: $(_selectors.editSafeLocalization).val(),
                            safeLattitude: $(_selectors.editSafeLattitude).val(),
                            safeLongitude: $(_selectors.editSafeLongitude).val()
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        type: "POST",
                        dataType: "json",
                    })
                        .then(function (ans) {
                            _handlers.updateSafesList(ans.id)
                            _handlers.displayAlert(_alerts.addSuccess);
                        })
                        .fail(function (err) {
                            _handlers.displayAlert(_alerts.addFail);
                            console.log("Error. Cannot add safe.")
                        });
                }
            },


            onSaveEditSafeClick: function () {
                if ($(_selectors.editSafeName) !== "") {
                    $.ajax({
                        url: '/safe/save',
                        data: JSON.stringify({
                            safeId: (sessionStorage.getItem('actualSafeId')),
                            safeName: $(_selectors.editSafeName).val(),
                            safeDescription: $(_selectors.editSafeDescription).val(),
                            safeLocalization: $(_selectors.editSafeLocalization).val(),
                            safeLattitude: $(_selectors.editSafeLattitude).val(),
                            safeLongitude: $(_selectors.editSafeLongitude).val()
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        type: "POST",
                        dataType: "json",
                        })
                        .then(function (ans) {
                            _handlers.updateSafesList(ans.id)
                            $(_selectors.safeModifyView).hide();
                            _handlers.displayAlert(_alerts.editSuccess);
                        })
                        .fail(function (err) {
                            _handlers.displayAlert(_alerts.editFail);
                            console.log("Error. Cannot edit safe.")
                        });
                }
            },


            onRemoveSafeClick: function () {

                $.ajax({
                    url: '/safe/remove',
                    data: JSON.stringify({
                        removedSafeId: sessionStorage.getItem('actualSafeId'),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    type: "DELETE",
                    dataType: "json",
                    })
                    .then((ans) => {
                        if (ans.status === 1 && ans.operations === 1) {
                            $('#safesList li[id =' + sessionStorage.getItem('actualSafeId') + ']').remove();
                            $(_selectors.safeView).hide();
                            $(_selectors.info).show();
                            $(_selectors.info).html(
                            _handlers.displayAlert(_alerts.removeSuccess)
                            );
                        }
                        else {
                            _handlers.displayAlert(_alerts.removeFail)
                        }
                    })
                    .fail(function (err) {
                        console.log("Error. Cannot remove safe.")
                    });
            },



            onSafeListItemClick: function (event) {
                $(_selectors.safeModifyView).hide();
                $(_selectors.info).hide();
                const selectedSafeId = event.currentTarget.id;
                sessionStorage.setItem('actualSafeId', selectedSafeId);
                $.ajax({
                    url: '/safe/select',
                    type: "GET",
                    data: {
                        selectedSafeId: selectedSafeId,
                    },
                    beforeSend: _handlers.displaySafeView()

                    })
                    .then(function (ans) {
                        let active = false
                        if (ans.loggedIn !== null && ans.loggedIn._id === ans.safe.owner) { active = true };
                        _handlers.fillSafeInformation(ans.safe, ans.owner.name);
                        _handlers.appendDiscoversList(ans);
                        _handlers.disableForbiddenActions(!active);
                        _handlers.enableLoggedUserActions(ans.loggedIn);
                        $(_selectors.info).hide();
                    })
                    .fail(function (err) {
                        console.log("Error. Cannot dispaly safe data.")
                    });
            },


            onToggleCheckboxClick: function (event) {
                $.ajax({
                    url: '/safe/markdiscovered',
                    data: JSON.stringify({
                        discoveredSafeId: sessionStorage.getItem('actualSafeId'),
                        discovered: event.target.checked
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    type: "POST",
                    dataType: "json",
                    })
                    .then((ans) => {
                        if (ans.success === false) {
                            $(_selectors.toggle).attr('checked', false);
                        }

                    })
                    .fail(function (err) {
                        console.log("Error. Cannot mark safe discovered.")
                    });
            },


            onEditSafeClick: function (event) {

                $.ajax({
                    url: '/safe/edit',
                    data: {
                        editSafeId: sessionStorage.getItem('actualSafeId'),
                    },
                    type: "GET",
                    beforeSend: function(){
                        $.get("../../views/edit.html", function (data) {
                            $(_selectors.editContent).html(data);
                        });
                    }
                    })
                    .then((ans) => {
                        $(_selectors.safeView).hide();
                        $(_selectors.addSafe).hide();
                        _handlers.fillEditForm(ans.safe);
                    })
                    .fail(function (err) {
                        console.log("Error. Cannot edit safe.")
                    });
            },


            onPrepareSafeClick: function () {
                $.get("../../views/edit.html", function (data) {
                    $(_selectors.editContent).html(data);

                }).then(() => {
                    $(_selectors.info).hide();
                    $(_selectors.safeView).hide();
                    $(_selectors.safeModifyView).show();
                    $(_selectors.acceptEditSafe).hide();
                });
            },

            onCancelEditClick: function () {
                _handlers.displayAlert(_alerts.cancelEdit)
                $(_selectors.safeModifyView).hide();
            },


            displayAlert: function (alert) {
                let message = '';
                switch (alert) {
                    case 0:
                        message = '<div class="alert alert-info"> <strong> List of safes is empty.</div>';
                        break;
                    case 1:
                        message = '<div class="alert alert-info"> Operation cancelled.</div>'
                        break;
                    case 2:
                        message = '<div class="alert alert-success"> Safe succesfully removed.</div>'
                        break;
                    case 3:
                        message = '<div class="alert alert-warning"> <strong>Error!</strong> Cannot remove safe.</div>'
                        break;
                    case 4:
                        message = '<div class="alert alert-success">  Safe added.</div>'
                        break;
                    case 5:
                        message = '<div class="alert alert-warning"> <strong>Error!</strong> Cannot add safe.</div>'
                        break;
                    case 6:
                        message = '<div class="alert alert-success"> Safe edited.</div>'
                        break;
                    case 7:
                        message = '<div class="alert alert-warning"> <strong>Error!</strong> Cannot edit safe.</div>'
                }
                $(_selectors.info).show();
                $(_selectors.info).html(message);
            },

            checkIfUserIsActive: function (loggedIn, safes) {
                if (loggedIn !== null) {
                    $(_selectors.logUser).text('Logout').addClass('btn-basic').removeClass('btn-info');
                }

                return (loggedIn !== null && _handlers.checkFirstSafeOwner(loggedIn, safes))
            },

            checkFirstSafeOwner: function (loggedIn, safes) {
                if (safes.length > 0) {
                    return (loggedIn._id === safes[0].owner) ? true : false
                }
                return false;
            },

            checkSafeUsersDiscovering: function (ans, discover) {
                if (ans.loggedIn !== null && discover.userId == ans.loggedIn._id) {
                    $(_selectors.toggle).attr('checked', true)
                }
            },

            enableLoggedUserActions: function (loggedIn) {
                if (loggedIn === null) {
                    $(_selectors.prepareSafe).attr('disabled', true)
                    $(_selectors.toggle).attr('disabled', true)
                }
                else {
                    $(_selectors.toggle).attr('disabled', false)
                    $(_selectors.prepareSafe).attr('disabled', false)
                }
            },


            fillSafeInformation: function (safe, ownerName) {
                if (safe !== undefined) {
                    $(_selectors.authorName).append(ownerName);
                    $(_selectors.safeNameId).text(safe.name);
                    $(_selectors.safeDescriptionId).text(safe.description);
                    $(_selectors.safeLocalizationnId).text(safe.localization);             

                    _handlers.initMap(safe.lattitude, safe.longitude);

                    sessionStorage.setItem('actualSafeId', safe._id);
                }
            },


            disableForbiddenActions: function (disable) {
                $(_selectors.removeSafeBtn).attr('disabled', disable)
                $(_selectors.editSafeBtn).attr('disabled', disable)
            },


            appendSafesList: function (safes) {
                safes.forEach(safe => {
                    $(_selectors.safesList).append('<li class="safeListItem" id=' + safe._id + '><div class="view">' +
                        '<h3>' + safe.name + '</h3>' + '<br><p>' + safe.description + '</p></div></li>');
                });

            },


            appendDiscoversList: function (ans) {
                if (ans.discovers.length > 0) {
                    ans.discovers.forEach(discover => {
                        _handlers.checkSafeUsersDiscovering(ans, discover);
                        $(_selectors.discoversList).append('<a href="#" class="list-group-item">' + discover.username + '</a>');
                    });
                }
            },


            displaySafeView: function (getSafeSessionData = false) {
                $.get("../views/display.html", function (data) {
                    $(_selectors.showContent).html(data);
                });
            },



            updateSafesList: function (id) {
                if ($('#' + id).length > 0) {
                    $('#' + id + ' .view > h3').text($(_selectors.editSafeName).val());
                    $('#' + id + ' .view > p').text($(_selectors.editSafeDescription).val());
                }
                else {
                    $(_selectors.safesList + ' li').first().after('<li class="safeListItem" id=' + id + '>' +
                        '<div class="view"><h3>' + $(_selectors.editSafeName).val() + '</h3>' +
                        '<p style="word-wrap: break-word">' + $(_selectors.editSafeDescription).val() + '</p></div></li>');
                }
            },


            fillEditForm: function (safe) {
                $(_selectors.editSafeName).val(safe.name);
                $(_selectors.editSafeDescription).val(safe.description);
                $(_selectors.editSafeLocalization).val(safe.localization);
                $(_selectors.editSafeLattitude).val(safe.lattitude);
                $(_selectors.editSafeLongitude).val(safe.longitude);
                $(_selectors.safeView).hide();
                $(_selectors.acceptEditSafe).show();

            },


            initMap: function (lattitude, longitude) {
                let point = { lat: lattitude, lng: longitude };
                let map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: lattitude, lng: longitude },
                    zoom: 8
                });

                let marker = new google.maps.Marker({
                    position: point,
                    map: map
                });
            }

        }

        $(document).ready(_handlers.onDocumentReady);
        $(document).on('click', _selectors.addSafe, _handlers.onAddSafeClick);
        $(document).on('click', _selectors.removeSafeBtn, _handlers.onRemoveSafeClick);
        $(document).on('click', _selectors.safeListItem, _handlers.onSafeListItemClick);
        $(document).on('click', _selectors.toggle, _handlers.onToggleCheckboxClick);
        $(document).on('click', _selectors.editSafeBtn, _handlers.onEditSafeClick);
        $(document).on('click', _selectors.prepareSafe, _handlers.onPrepareSafeClick);
        $(document).on('click', _selectors.editCancel, _handlers.onCancelEditClick);
        $(document).on('click', _selectors.acceptEditSafe, _handlers.onSaveEditSafeClick);

    });
});


