'use strict';

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.companyInfo == undefined) {
    app.wizard.companyInfo = {};
}

if (app.wizard.companyInfo.summary == undefined) {
    app.wizard.companyInfo.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();

    let dto = app.wizard.companyInfo.dto;

    let productGuids = app.wizard.common.page.productGuids;

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

                let value = super.set(name, show, fn);
                let text = value;
                if (dto.controls[name].hasOwnProperty('guid') == true && dto.controls[name].filters.length > 0) {
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

        show(div, name, show) {

        }

        apply(dto, appId) {
            this.self = this;
            this.appId = appId;
            this.root = document.getElementById('tbody-company-info-summary-' + this.appId);
            helpers.clearTable('tbody-company-info-summary-' + this.appId);
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

}(app.wizard.companyInfo.summary));
