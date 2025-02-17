if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.mandateFit = {};

(function (mandateFit) {

    function RemoveSpaces(value) {
        return value.toString().replace(/\s/g, '');
    }

    function RemoveLastChar(value) {
        return value.substr(0, value.length - 1);
    }

    function IsANumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function FormatNumberWithSpaces(value) {
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }

    function OnInputFormatCurrency(value) {
        // remove spaces
        let temp = RemoveSpaces(value);

        // ensure value is a number
        if (IsANumber(temp)) {
            // format to include symbol and value with number formatting
            temp = FormatNumberWithSpaces(temp);
        } else {
            // if not number remove last input and return
            temp = RemoveLastChar(temp);
        }
        return temp;
    }

    let helpers = app.onboard.helpers.get();

    let controls = {
        loanAmount: app.control.input('name-input-mandate-fit-loan-amount', 'id-input-mandate-fit-loan-amount'),
        cashFlowRepayable : app.control.radio('name-input-mandate-fit-forecast-cash-flow-repayable'),
        conflictOfInterest : app.control.radio('name-input-mandate-fit-conflict-of-interest-at-sefa'),
        oppWithinSaBorders : app.control.radio('name-input-mandate-fit-operations-within-boarders-sa'),
        interestGreaterThan50 : app.control.radio('name-input-mandate-fit-controlling-interest-greater-than-50'),
        shareholderInvolved : app.control.radio('name-input-mandate-fit-shareholder-involved'),
        teamHasXpSkills : app.control.radio('name-input-mandate-fit-management-team-has-xp-skills')
    };

    class DtoToPage {
        constructor() {
            this.json = null;
        }

        reset(json) {
            json['mandate-fit'] = {
                'mandate-fit-loan-amount' : '',
                'mandate-fit-forecast-cash-flow-repayable': '',
                'mandate-fit-conflict-of-interest-at-sefa': '',
                'mandate-fit-operations-within-boarders-sa': '',
                'mandate-fit-controlling-interest-greater-than-50': '',
                'mandate-fit-shareholder-involved': '',
                'mandate-fit-management-team-has-xp-skills': ''
            };
        }

        loanAmount() {
            let val = helpers.getProp(this.json, 'mandate-fit-loan-amount', '');
            val = OnInputFormatCurrency(val);
            controls.loanAmount.val(val);
        }

        cashFlowRepayable() {
            let val = helpers.getProp(this.json, 'mandate-fit-forecast-cash-flow-repayable', '');
            controls.cashFlowRepayable.val(val);
        }

        conflictOfInterest() {
            let val = helpers.getProp(this.json, 'mandate-fit-conflict-of-interest-at-sefa', '');
            controls.conflictOfInterest.val(val);
        }

        oppWithinSaBorders() {
            let val = helpers.getProp(this.json, 'mandate-fit-operations-within-boarders-sa', '');
            controls.oppWithinSaBorders.val(val);
        }

        interestGreaterThan50() {
            let val = helpers.getProp(this.json, 'mandate-fit-controlling-interest-greater-than-50', '');
            controls.interestGreaterThan50.val(val);
        }

        shareholderInvolved() {
            let val = helpers.getProp(this.json, 'mandate-fit-shareholder-involved', '');
            controls.shareholderInvolved.val(val);
        }

        teamHasXpSkills() {
            let val = helpers.getProp(this.json, 'mandate-fit-management-team-has-xp-skills', '');
            controls.teamHasXpSkills.val(val);
        }

        apply(json) {
            this.json = json;
            this.loanAmount();
            this.cashFlowRepayable();
            this.conflictOfInterest();
            this.oppWithinSaBorders();
            this.interestGreaterThan50();
            this.shareholderInvolved();
            this.teamHasXpSkills();
        }
    }

    class PageToDto {
        constructor() {
            this.json = null;
        }

        loanAmount() {
            let val = controls.loanAmount.val();
            val = val.replace(/ /g, '');
            helpers.setProp(this.json, 'mandate-fit-loan-amount', val);
        }

        cashFlowRepayable() {
            let val = controls.cashFlowRepayable.val();
            helpers.setProp(this.json, 'mandate-fit-forecast-cash-flow-repayable', val);
        }

        conflictOfInterest() {
            let val = controls.conflictOfInterest.val();
            helpers.setProp(this.json, 'mandate-fit-conflict-of-interest-at-sefa', val);
        }

        oppWithinSaBorders() {
            let val = controls.oppWithinSaBorders.val();
            helpers.setProp(this.json, 'mandate-fit-operations-within-boarders-sa', val);
        }

        interestGreaterThan50() {
            let val = controls.interestGreaterThan50.val();
            helpers.setProp(this.json, 'mandate-fit-controlling-interest-greater-than-50', val);
        }

        shareholderInvolved() {
            let val = controls.shareholderInvolved.val();
            helpers.setProp(this.json, 'mandate-fit-shareholder-involved', val);
        }

        teamHasXpSkills() {
            let val = controls.teamHasXpSkills.val();
            helpers.setProp(this.json, 'mandate-fit-management-team-has-xp-skills', val);
        }

        apply(json) {
            this.json = json;
            this.loanAmount();
            this.cashFlowRepayable();
            this.conflictOfInterest();
            this.oppWithinSaBorders();
            this.interestGreaterThan50();
            this.shareholderInvolved();
            this.teamHasXpSkills();
        }
    }

    let dtoToPage = new DtoToPage();
    let pageToDto = new PageToDto();
    let propJson = null;
    let companyId = null;

    mandateFit.init = function (cb) {
        controls.loanAmount.val('');
        controls.loanAmount.format(10, function (val) {
            return OnInputFormatCurrency(val);
        });
        cb(AddStatus());
    }

    mandateFit.loadDto = function(cb) {
        this.init(function (status) {
            cb(status, null);
        });
    }

    mandateFit.submitDto = function(cb, partial = true) {
        cb(AddStatus());
    }

    mandateFit.validate = function(foreward, cb) {
        let status = AddStatus();
        cb(status);
    }

    mandateFit.attention = function (from, to, foreward, cb) {
        let dto = app.onboard.company.getCurrentDto();
        propJson = dto.propertiesJson;
        companyId = dto.id;
        if (foreward == true) {
            if (helpers.hasProp(propJson, 'mandate-fit') == true) {
            } else {
                dtoToPage.reset(propJson);
            }
            dtoToPage.apply(propJson['mandate-fit']);
            cb(AddStatus());
        } else {
            cb(AddStatus());
        }
    }

    mandateFit.neglect = function (from, to, foreward, cb) {
        pageToDto.apply(propJson['mandate-fit']);
        app.onboard.company.submitDto(function (status, result) {
            cb(AddStatus());
        }, app.onboard.owner.dto.owner.id);
    }

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

    function setTooltip(text, index) {
        let i = '#' + 'col2-id-' + index.toString();
        $(i).tooltip({
            title: text,
            html: false,
            placement: "right"
        });
    }

})(app.onboard.mandateFit);
