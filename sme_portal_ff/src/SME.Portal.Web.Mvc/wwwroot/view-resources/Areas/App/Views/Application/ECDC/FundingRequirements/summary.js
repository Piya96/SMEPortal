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

if (app.wizard.fundingRequirements.summary == undefined) {
    app.wizard.fundingRequirements.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    let dto = app.wizard.fundingRequirements.dto;

    class DtoSummary extends dto.DtoToHtml {
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
                if (dto.controls[name].filters.length > 0) {
                    let obj = dto.controls[name].filters[0](value);
                    if (obj != null) {
                        text = obj.text;
                    }
                } else {
                    text = value;
                }
                $('#' + leftId).text(dto.controls[name].label);
                $('#' + rightId).text(text);
                return value;
            }
        }

        show(div, name, show) {

        }

        isImvabaEnterpriseActive() {
            //return false;
            let value = helpers.getPropEx(this.dto, 'input-product-guid', '');
            return value == '650c2fc52207cebdf845a80f';
        }

        apply(dto, appId) {
            this.appId = appId;
            this.dto = dto;
            this.root = document.getElementById('tbody-funding-requirements-summary-' + this.appId);
            helpers.clearTable('tbody-funding-requirements-summary-' + this.appId);
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

}(app.wizard.fundingRequirements.summary));
