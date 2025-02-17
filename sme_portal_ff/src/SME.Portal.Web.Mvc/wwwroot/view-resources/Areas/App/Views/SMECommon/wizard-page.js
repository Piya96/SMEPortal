// A wizard page should have a minimum set of methods that will be implemented
// by page specific object which is derived from a base wizard page object.

// The base wizard page will implement an interface defined by base wizard controller
// so it can be sent notification from the controller key to the wizard flow process.

"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    function Base() {
        this.name = 'Wizard Base Page';
    }

    Base.prototype.init = function (cb) {

    }

    Base.prototype.load = function (cb) {

    }

    page.base = function () {
        return new Base();
    }

})(app.wizard.page);
