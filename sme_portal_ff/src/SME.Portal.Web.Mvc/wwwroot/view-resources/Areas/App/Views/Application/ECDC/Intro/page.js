"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.intro == undefined) {
    app.wizard.intro = {};
}

if (app.wizard.intro.page == undefined) {
    app.wizard.intro.page = {};
}

(function (page) {

    class IntroPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'ECDC Intro Page';
            this.backgroundCheck = null;
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        addControls() {
        }

        addHandlers() {
        }
    }

    page.create = function (id) {
        return new IntroPage(id);
    }
})(app.wizard.intro.page);
