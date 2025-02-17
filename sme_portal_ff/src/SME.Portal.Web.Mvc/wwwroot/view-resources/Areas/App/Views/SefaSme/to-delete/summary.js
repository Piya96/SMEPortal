'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.summary = null;

(function (onboard) {

    let failInfoShow = true;

    function addRow(id, key, value, index) {
        let row = document.createElement('tr');
        let col1 = document.createElement('td');
        col1.classList.add('td-label');
        col1.innerHTML = key;
        let col2 = document.createElement('td');

        let span = document.createElement('span');
        col2.appendChild(span);
        span.classList.add(value == 'PASSED' ? 'td-pass' : 'td-fail');

        span.setAttribute('id', 'col2-id-' + index.toString());
        span.innerHTML = value == 'PASSED' ? 'PASSED' : 'FAILED';

        let root = document.getElementById(id);
        root.appendChild(row);
        row.appendChild(col1);
        row.appendChild(col2);
    }

    function clearTable(id) {
        function removeNode(root) {
            while (root.firstChild) {
                removeNode(root.firstChild);
                root.removeChild(root.firstChild);
            }
        }
        let root = document.getElementById(id);
        removeNode(root);
    }

    function setTooltip(text, index) {
        let i = '#' + 'col2-id-' + index.toString();
        $(i).tooltip({
            title: text,
            html: false,
            placement: "right"
        });
    }


    function executeBackgroundChecksPresentationPass(result, cb) {
        $('#id-div-summary-madate-fit-pass').show('fast');
        for (const key in result.Checks) {
            let value = result.Checks[key];
        }
        cb(AddStatus());
    }

    function executeBackgroundChecksPresentationFail(result, cb) {
        //let root = document.getElementById('id-tbody-mandate-fit-list');
        //let row = document.createElement('tr');
        //root.appendChild(row);
        //let header = document.createElement('th');
        //header.innerHTML = "Check";
        //row.appendChild(header);
        //header = document.createElement('th');
        //header.innerHTML = "Result";
        //row.appendChild(header);

        $('#id-div-summary-madate-fit-fail').show('fast');
        //let json = result;
        //let index = 1;
        //for (const key in json.Checks) {
        //    let value = json.Checks[key];
        //    addRow('id-tbody-mandate-fit-list', key, value, index++);
        //}
        //index = 1;
        //for (const key in json.Checks) {
        //    let value = json.Checks[key];
        //    if (value != 'PASSED') {
        //        setTooltip(value, index++);
        //    }
        //    index++;
        //}
        cb(AddStatus());
    }

    function executeBackgroundChecksPresentation(status, result, cb) {
        if (status.code == 0) {
            executeBackgroundChecksPresentationPass(result, function (status) {
                cb(AddStatus());
            });
        } else {
            //clearTable('id-tbody-mandate-fit-list');
            executeBackgroundChecksPresentationFail(result, function (status) {
                cb(AddStatus());
            });
        }
    }

    function updateCompanyDto(cb) {
        let dto = app.onboard.company.getCurrentDto();
        app.onboard.service.getUserCompany(dto.id, function (status, result) {
            // Pointer to company dto. Changes made here will reflect directly.
            dto.propertiesJson = JSON.parse(result.smeCompany.propertiesJson);
            cb(AddStatus());
        });
    }

    function executeBackgroundChecksLogic(cb) {
        let dto = app.onboard.company.getCurrentDto();
        let companyId = dto.id;

        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: 'Performing background checks...'
        });

        abp.services.app.smeCompaniesAppServiceExt.basicScreeningCheck(companyId).done(function (result) {
            let status = AddStatus();
            let json = JSON.parse(result);
            if (json.Success != true) {
                status.code = 1;
            }
            //for (const key in json.Checks) {
            //    let value = json.Checks[key];
            //    if (value != 'PASSED') {
            //        status.code = 1;
            //        break;
            //    }
            //}
            KTApp.unblockPage();
            cb(status, json);
        });
    }

    function executeBackgroundChecks(cb) {
        executeBackgroundChecksLogic(function (status, result) {

            executeBackgroundChecksPresentation(status, result, function (status) {

                updateCompanyDto(function (status) {

                    cb(AddStatus());

                });

            });

        });
    }

    function renderCompanySummaries(cb) {
    
        app.fss.controller.renderOnboarding(
            app.onboard.user.dto,
            app.onboard.owner.dto,
            app.onboard.company.getDto(0),
            "0"
        )
    
        cb(AddStatus());
    }

    function addHandlers() {
        $('#a-basic-screening-fail-info').on('click', (ev) => {
            if (failInfoShow == true) {
                $('#parent-basic-screening-fail-info').show('fast');
            } else {
                $('#parent-basic-screening-fail-info').hide('fast');
            }
            failInfoShow ^= true;
        });

        $('#a-basic-screening-fail-redirect').on('click', (ev) => {
        });
    }

    function loadDto(cb) {
        addHandlers();

        cb(AddStatus());
    }
    
    function validate(foreward, cb) {
        cb(AddStatus());
    }

    function attention(from, to, foreward, cb) {
        failInfoShow = true;
        $('#id-div-summary-madate-fit-pass').hide('fast');
        $('#id-div-summary-madate-fit-fail').hide('fast');
        $('#parent-basic-screening-fail-info').hide('fast');
        if (foreward == true) {
            renderCompanySummaries(function (status) {

                executeBackgroundChecks(function (status) {

                    cb(status);

                })
            });
        }
    }

    function neglect(from, to, foreward, cb) {

        cb(AddStatus());
    }
    
    onboard.summary = {
        loadDto: loadDto,
        attention: attention,
        neglect: neglect,
        validate: validate
    };

})(app.onboard);
