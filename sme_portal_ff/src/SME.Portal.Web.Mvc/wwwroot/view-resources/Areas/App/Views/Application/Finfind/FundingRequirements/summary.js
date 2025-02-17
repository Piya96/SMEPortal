'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.fundingRequirements == undefined) {
    app.wizard.fundingRequirements = {};
}

// TODO: Look at making this part of dto.
if (app.wizard.fundingRequirements.summary == undefined) {
    app.wizard.fundingRequirements.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();

    let dto = app.wizard.fundingRequirements.dto;

    class DtoSummary extends dto.DtoToHtml {
        constructor(self) {
            super(self);
            this.appId = null;
            this.root = null;
        }

        show(name, enable) {
        }

        set(name, enable) {
            let self = this.self;

            function getValue(value) {
                let val = [];
                if (dto.controls[name].hasOwnProperty('guid') == true) {
                    value.forEach((item, idx) => {
                        let temp = app.listItems.obj.getLabel(dto.controls[name].guid, item);
                        val.push(temp);
                    });
                } else {
                    val = value;
                }
                let result = val;
                let isArray = Array.isArray(val);
                if (isArray == true) {
                    result = val[0];
                }
                dto.controls[name].filters.forEach((fn, i) => {
                    result = fn(result);
                });
                if (isArray == true) {
                    val[0] = result;
                } else {
                    val = result;
                }
                return val;
            }

            if (enable == true) {
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

                let value = self.helpers.getPropEx(self.dto, name, '');
                let val = getValue(value);
                let label = dto.controls[name].label;

                $('#' + leftId).text(label);
                let text = '';
                val.forEach((item, idx) => {
                    text += item;
                    if (idx != (val.length - 1)) {
                        text += '<br/>';
                    }
                });
                $('#' + rightId).html(text);

                return value;
            } else {
                return '';
            }
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable = true) {
            if (enable == true) {
                let value = this.helpers.getPropEx(this.dto, 'select-sic-sub-class', '');
                let result = app.wizard.isb.findFromId(value[0], 5);
                if (result != null && result != '') {
                    let names = [
                        'select-sic-section',
                        'select-sic-division',
                        'select-sic-group',
                        'select-sic-class',
                        'select-sic-sub-class'
                    ];
                    names.forEach((name, index) => {
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

                        let label = dto.controls[name].label;
                        $('#' + leftId).text(label);
                        let text = result[index + 1].desc;
                        $('#' + rightId).html(text);
                    });
                }
            }
        }

        applyExt(dto, appId) {
            this.self = this;
            this.helpers = helpers;
            this.self.helpers = helpers;
            this.appId = appId;
            this.self.dto = dto;
            this.root = document.getElementById('tbody-funding-requirements-summary-' + this.appId);
            this.helpers.clearTable('tbody-funding-requirements-summary-' + this.appId);
            super.apply();
        }
    }

    function Render(dto, appId) {
        let summary = new DtoSummary(null);
        summary.applyExt(dto, appId);
    }

    summary.render = function (dto, appId) {
        if (dto != null) {
            Render(dto, appId);
        }
    };

}(app.wizard.fundingRequirements.summary));
