/*
'use strict';

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.financialInfo == undefined) {
    app.wizard.financialInfo = {};
}

if (app.wizard.financialInfo.summary == undefined) {
    app.wizard.financialInfo.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();
    let dto = app.wizard.financialInfo.dto;

    //let productGuids = app.wizard.common.page.productGuids;

    class DtoSummary extends app.wizard.financialInfo.dto.DtoToHtml {
        constructor(self) {
            super(self);
            this.appId = null;
            this.root = null;
        }

        set(name, show, fn = []) {
            if (show == false) {
                return '';
            } else {
                let self = this.self;
                let tr = document.createElement('tr');
                let left = document.createElement('td');
                left.setAttribute('style', 'width:55%;');
                let right = document.createElement('td');
                this.root.appendChild(tr);
                tr.appendChild(left);
                tr.appendChild(right);
                let leftId = 'left-' + name + '-' + this.appId;
                let rightId = 'right-' + name + '-' + this.appId;
                left.setAttribute('id', leftId);
                right.setAttribute('id', rightId);
                //let value = helpers.getPropEx(this.dto, name, '');
                let value = super.set(name, show, fn);
                let text = '';
                if (dto.controls.hasOwnProperty(name) == false) {
                    let x = false;
                }
                if (dto.controls[name].filters.length > 0) {
                    let obj = dto.controls[name].filters[0](value);
                    if (obj != null) {
                        text = obj.text;
                    }
                } else {
                    text = value;
                }

                $('#' + leftId).text(dto.controls[name].label);
                $('#' + rightId).html(text);
                return value;
            }
        }

        setMult(name, show, fn = []) {
            let values = super.setMult(name, show, fn);
            if (values.length == 0 || show == false) {
                return values;
            } else {
                let tr = document.createElement('tr');
                let left = document.createElement('td');
                left.setAttribute('style', 'width:55%;');
                let right = document.createElement('td');
                this.root.appendChild(tr);
                tr.appendChild(left);
                tr.appendChild(right);
                let leftId = 'left-' + name + '-' + this.appId;
                let rightId = 'right-' + name + '-' + this.appId;
                left.setAttribute('id', leftId);
                right.setAttribute('id', rightId);

                let rightText = '';
                values.forEach((value, idx) => {
                    let obj = dto.controls[name].filters.length > 0
                        ? dto.controls[name].filters[0](value)
                        : { value: '0', text: 'None' };

                    if (obj != null) {
                        rightText += obj.text;
                    }
                    if (idx < (values.length - 1)) {
                        rightText += '<br />';
                    }
                });
                $('#' + leftId).text(dto.controls[name].label);
                $('#' + rightId).html(rightText);
                return values;
            }
        }

        show(div, name, show) {
        }

        // TODO: Override in tenant specific folder.
        companyContribution() {
            // Note: Requested for removal in ECDC and Finfind. Not Sefa.
            this.set('input-company-contribution', false, []);
        }

        apply(dto, appId) {
            this.self = this;
            this.appId = appId;
            this.dto = dto;
            this.root = document.getElementById('tbody-financial-info-summary-' + this.appId);
            helpers.clearTable('tbody-financial-info-summary-' + this.appId);
            super.apply(dto);
        }
    }

    function Render(dto, appId) {
        let summary = new DtoSummary(null);
        summary.apply(dto, appId);
    }

    summary.render = function (dto, appId) {
        if (dto != null) {
            Render(dto, appId);
        }
    };

    summary.DtoSummary = DtoSummary;

}(app.wizard.financialInfo.summary));
*/
