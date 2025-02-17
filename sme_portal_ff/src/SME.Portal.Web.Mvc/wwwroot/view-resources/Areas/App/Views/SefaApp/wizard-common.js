"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

(function(wizard) {

    wizard.Result = {
        Success: 0,
        Fail: 1,
        Warning: 2,
        WarningUpdated: 3,
        Cancel: 4
    };

    wizard.addResult = function() {
        return {
            status : wizard.Result.Success,
            exception : false,
            code : 0,
            message : '',
            data : null
        }
    };

    wizard.Pages = {
        Page1 : 0,
        Page2 : 1,
        Page3 : 2,
        Page4 : 3,
        Page5 : 4,
        Page6 : 5,
        Page7 : 6,
        Page8 : 7,
        Page9 : 8,
        Page10 : 10
    };

})(app.wizard);

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    class Common {
        constructor() {
            this.name = 'Wizard Common';
            this.listItems = app.listItems.get();
            this.helpers = app.onboard.helpers.get();
            this.model = null;
        }

        init() {
        }
    }

    page.getCommon = function () {
        return new Common();
    }

    page.Common = Common;

})(app.wizard.page);
