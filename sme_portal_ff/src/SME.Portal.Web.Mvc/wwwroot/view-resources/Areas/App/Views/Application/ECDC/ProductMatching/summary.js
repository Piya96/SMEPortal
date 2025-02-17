'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.productMatching == undefined) {
    app.wizard.productMatching = {};
}

if (app.wizard.productMatching.summary == undefined) {
    app.wizard.productMatching.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    class DtoSummary {
        constructor(self) {
            this.appId = null;
            this.root = null;
        }

        productMatch() {
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
            let value = helpers.getPropEx(this.dto, 'input-product-guid', '');
            let text = '';
            let obj = listItems.getProduct(value);
            if (obj != null) {
                text = obj.text;
            }
            $('#' + leftId).text('Product Matched');
            $('#' + rightId).text(text);
        }

        apply(dto, appId) {
            this.appId = appId;
            this.dto = dto;
            this.root = document.getElementById('tbody-product-matching-summary-' + this.appId);
            helpers.clearTable('tbody-product-matching-summary-' + this.appId);
            this.productMatch();
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

}(app.wizard.productMatching.summary));
