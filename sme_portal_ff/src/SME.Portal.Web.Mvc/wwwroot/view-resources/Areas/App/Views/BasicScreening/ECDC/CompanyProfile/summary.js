'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.company == undefined) {
    app.fss.company = {};
}

(function (company) {

    let helpers = app.onboard.helpers.get();

    class ECDC extends app.fss.company.Baseline {
        constructor() {
            super();
        }

        addressRegion() {
            let value = helpers.getPropEx(this.json, 'regional-office', '');
            let obj = value == '' ? '' : app.listItems.obj.getRegion(value);
            let text = (obj != null && obj != '') ? obj.text : '';
            $('#td-regional-office-' + this.appId).text(text);
            $('#tr-regional-office-' + this.appId).show();
        }

        apply(dto, appId) {
            super.apply(dto, appId);
            this.addressRegion();
        }
    }

    company.create = function () {
        return new ECDC();
    }

    company.ECDC = ECDC;

}(app.fss.company));
