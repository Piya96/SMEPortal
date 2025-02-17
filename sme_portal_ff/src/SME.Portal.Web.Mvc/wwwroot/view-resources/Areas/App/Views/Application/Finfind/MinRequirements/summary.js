'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.keyThings == undefined) {
    app.wizard.keyThings = {};
}

// TODO: Look at making this part of dto.
if (app.wizard.keyThings.summary == undefined) {
    app.wizard.keyThings.summary = {};
}

(function (summary) {
    let helpers = app.onboard.helpers.get();

    class Summary {
        constructor() {
            this.dto = null;
            this.appId = null;
        }

        text(id, value) {
            $('#' + id + '-' + this.appId).text(value);
        }

        proofOfTurnnover() {
            let value = helpers.getPropEx(this.dto, 'turn-over-doc-name', '');
            this.text('td-summary-turnover-proof', value);
        }

        bankStatements() {
            let value = helpers.getPropEx(this.dto, 'bank-statements-doc-name', '');
            this.text('td-summary-bank-statements', '3 months bank statements');
        }

        creditScoreConsent() {
            let value = helpers.getPropEx(this.dto, 'input-credit-score-declaration', '');
            this.text('td-summary-credit-score-consent', value == '' ? 'No' : 'Yes');
            if (value == "Yes") {
                $('#tr-summary-credit-score-value').show();
                let value = helpers.getPropEx(this.dto, 'credit-score', '');
                this.text('td-summary-credit-score-value', value);
            } else {
                $('#tr-summary-credit-score-value').hide();
            }
        }

        apply(dto, appId) {
            this.dto = dto;

            this.appId = appId;

            this.proofOfTurnnover();
            this.bankStatements();
            this.creditScoreConsent();
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

}(app.wizard.keyThings.summary));
