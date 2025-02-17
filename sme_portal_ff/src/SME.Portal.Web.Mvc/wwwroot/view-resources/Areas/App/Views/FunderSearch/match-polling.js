function SMEMatchPolling(cb, reload, view) {

    let _reload = reload == 'True';

    let pollingInterval = 2000;

    let registeredEvents = false;

    let ResultEnum = {
        Success : 0,
        Warning : 1,
        Fail : 2,
        Exception : 3
    };

    let AppStatusEnum = {
        QueuedForMatching: 'QueuedForMatching',
        Matched: 'Matched',
        MatchedNoResults: 'MatchedNoResults',
        Locked: 'Locked'
    };

    let editModalValidation = null;

    let editModal = new smec.modal('id-appication-matching-modal-div', 'id-modal-save');

    let actionCallback = cb;

    let apps = [];

    function toggleAnchor(anchorId, applicationId, enable) {
        let id = anchorId + applicationId.toString();
        smec.toggleAnchor(id, enable);
        //let elem = document.getElementById(id);
        //if (elem != null) {
        //    elem.style['pointer-events'] = enable == false ? 'none' : 'initial';
        //}
    }

    function lockClickEvent() {

        function lockApplicationMatch(applicationId) {
            toggleAnchor('id-funding-app-summary-lock-a-', applicationId, false);
            toggleAnchor('id-funding-app-summary-edit-a-', applicationId, false);

            if (actionCallback != null) {
                let output = {
                    data: {
                        id : applicationId
                    }
                };
                actionCallback('Lock', output);
            }
        }
    
        Swal.fire({
            title: app.localize('ConfirmConfirmation'),
            icon: "info",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (args) {
            if (args.isConfirmed == true) {
                let app = getActiveApplication();
                if (app != null) {
                    lockApplicationMatch(app.applicationId);
                }
            }
            if (args.isDenied == true) {
            }
        });
    }

    function deleteClickEvent() {

        function deleteApplicationMatch(
            applicationId,
            matchId
        ) {
            let input = {
                applicationId: applicationId,
                matchId: matchId
            }
            abp.services.app.applicationAppServiceExt.delete(input).done(function (output) {
                if (output.result == ResultEnum.Success) {
                    if (actionCallback != null) {
                        actionCallback('Delete', output);
                    }
                }
            });
        }

        Swal.fire({
            title: app.localize('DeleteConfirmation'),
            icon: "info",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function (args) {
            if (args.isConfirmed == true) {
                let app = getActiveApplication();
                if (app != null) {
                    deleteApplicationMatch(app.applicationId, app.matchId);
                }
            }
            if (args.isDenied == true) {
            }
        });
    }

    function editClickEvent() {

        function editActionCallback(action, cb) {

            function onSave(cb) {

                function onValid() {
                    let app = getActiveApplication();
                    let input = {
                        applicationId: app.applicationId,
                        loanAmount: $('#id-appication-matching-modal-loan-amount-input').val(),
                        annualTurnover: $('#id-appication-matching-modal-annual-turnover-input').val()
                    }
                    abp.services.app.applicationAppServiceExt.edit(input).done(function (output) {
                        if (output.result == ResultEnum.Success) {
                            if (actionCallback != null) {
                                window.setTimeout(function () {
                                    actionCallback('Edit', output);
                                }, 600);
                            }
                        }
                    });
                }

                editModalValidation.validate().then(function (status) {
                    let valid = status == 'Valid';
                    if (valid == true) {
                        onValid();
                    }
                    cb(valid);
                });
            }

            function onShow() {
                editModalValidation.resetForm(true);
            }

            switch (action) {
                case 'Save':
                    onSave(cb);
                    break;

                case 'Show':
                    onShow();
                    break;
            }
        }

        editModal.show(editActionCallback);
    }

    function getActiveApplication() {
        for (let i = 0, max = apps.length; i < max; i++) {
            let divId = 'app-' + apps[i].applicationId.toString();
            if ($('#' + divId).hasClass('show') == true) {
                return apps[i];
            }
        }
        return null;
    }

    function registerLockClickEvents() {
        for (let i = 0, max = apps.length; i < max; i++) {
            $('#id-funding-app-summary-lock-a-' + apps[i].applicationId.toString()).on('click', function (args) {
                lockClickEvent()
            });
        }
    }

    function registerDeleteClickEvents() {
        for (let i = 0, max = apps.length; i < max; i++) {
            $('#id-funding-app-summary-delete-a-' + apps[i].applicationId.toString()).on('click', function (args) {
                deleteClickEvent()
            });
        }
    }

    function registerEditClickEvents() {
        for (let i = 0, max = apps.length; i < max; i++) {
            $('#id-funding-app-summary-edit-a-' + apps[i].applicationId.toString()).on('click', function (args) {
                editClickEvent()
            });
        }
    }

    function updateMatchCount() {
        abp.services.app.applicationAppServiceExt.getAllMatches().done(function (output) {
            function setStatusColor(id, clazz) {
                $('#' + id).removeClass('sme-label-queued');
                $('#' + id).removeClass('sme-label-match');
                $('#' + id).removeClass('sme-label-nomatch');
                $('#' + id).removeClass('sme-label-locked');
                $('#' + id).addClass(clazz);
            }

            let fountAtLeastOneStillQueued = false;
            let applicationId = null;
            for (let i = 0, max = output.data.matches.length; i < max; i++) {
                let match = output.data.matches[i];
                let obj = {
                    applicationId: match.applicationId,
                    matchId: match.matchId,
                    status: match.status,
                    matchCount : 0
                };
                let count = 0;
                if (match.ids == '') {

                } else {
                    let temp = match.ids.split(',');
                    count = temp.length;
                }
                obj.matchCount = count;
                apps.push(obj);
                let matchStatusStr = '';
                let matchStatusColor = '';
                let actionEdit = false;
                let actionLock = false;
                switch (obj.status) {
                    case AppStatusEnum.QueuedForMatching:
                        fountAtLeastOneStillQueued = true;
                        // yellow. label-light-warning
                        matchStatusStr = app.localize('StatusQueued');
                        matchStatusColor = 'sme-label-queued';
                        // Lock is grey.
                        actionLock = false;
                        // Flexi-edit is grey.
                        actionEdit = false;
                        break;

                    case AppStatusEnum.Matched:
                        // green
                        matchStatusStr = app.localize('StatusMatched');
                        matchStatusColor = 'sme-label-match';
                        // Lock is active.
                        actionLock = true;
                        // Flexi-edit is active.
                        actionEdit = true;
                        break;

                    case AppStatusEnum.MatchedNoResults:
                        // orange
                        matchStatusStr = app.localize('StatusNoMatches');
                        matchStatusColor = 'sme-label-nomatch';
                        // Lock is active.
                        actionLock = true;
                        // Flexi-edit is active.
                        actionLock = true;
                        break;

                    case AppStatusEnum.Locked:
                        matchStatusStr = app.localize('StatusLocked');
                        matchStatusColor = 'sme-label-locked';
                        // Lock is grey.
                        actionLock = false;
                        // Flexi-edit is grey.
                        actionLock = false;
                        break;

                    default:
                        matchStatusStr = app.localize('StatusUnknown');
                        matchStatusColor = 'bg-info';
                        break;
                }
                let applicationIdStr = obj.applicationId.toString();
                let statusId = 'id-match-status-span-' + applicationIdStr;
                setStatusColor(statusId, matchStatusColor);
                $('#' + statusId).text(matchStatusStr);
                $('#id-match-status-div-left-' + applicationIdStr).show();
                $('#id-match-status-div-right-' + applicationIdStr).show();

                toggleAnchor('id-funding-app-summary-lock-a-', match.applicationId, actionLock);
                toggleAnchor('id-funding-app-summary-edit-a-', match.applicationId, actionEdit);
            }
            for (let i = 0, max = apps.length; i < max; i++) {
                toggleAnchor('id-funding-app-actions-a-', apps[i].applicationId, true);

                let applicationIdStr = apps[i].applicationId.toString();

                applicationId = apps[i].applicationId;

                $('#id-matches-' + applicationIdStr).text(app.localize('MatchesFound') + apps[i].matchCount);
            }
            // TODO: Make this 10000 variable!
            if (fountAtLeastOneStillQueued == true) {
                window.setTimeout(function () {
                    updateMatchCount();
                }, pollingInterval);
            }
            if (registeredEvents == false) {
                registeredEvents = true;
                registerLockClickEvents();
                registerDeleteClickEvents();
                registerEditClickEvents();
            }

            if (actionCallback != null) {
                actionCallback('GetAllMatches', output);
            }
            if (fountAtLeastOneStillQueued == false && _reload == true) {
                let output = {
                    view: view,
                    id: applicationId
                };
                /*actionCallback('Reload', output);*/
            }
        });
    }
    updateMatchCount();
};
