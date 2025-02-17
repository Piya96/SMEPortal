'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.lenderDocuments == undefined) {
    app.wizard.lenderDocuments = {};
}

if (app.wizard.lenderDocuments.summary == undefined) {
    app.wizard.lenderDocuments.summary = {};
}

(function (summary) {
    let helpers = app.onboard.helpers.get();

    class Summary {
        constructor() {
            this.dto = null;
            this.appId = null;
        }

        apply(dto, appId) {
            this.dto = dto;
            this.appId = appId;
            for (let i = 0; i < 22; i++) {
                let name = 'one' + (i + 1).toString();
                let id = name + '-' + appId.toString();
                let value = helpers.getPropEx(dto, name, '');
                $('#' + id).text(value == 'No App' ? 'Not Applicable' : value);
            }
        }
    }

    function Render(dto, appId) {
        let summary = new Summary();
        summary.apply(dto, appId);
    }

    summary.render = function (dto, appId) {
        if (dto != null) {
            Render(dto, appId);
        }
    };

    summary.Finfind = Summary;

}(app.wizard.lenderDocuments.summary));
