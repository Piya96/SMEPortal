"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.business == undefined) {
    app.wizard.business = {};
}

if (app.wizard.business.page == undefined) {
    app.wizard.business.page = {};
}

(function (page) {

    class FinfindDtoToPage extends app.wizard.business.page.DtoToPage {
        constructor(self) {
            super(self);
        }

        apply(dto) {
            super.apply(dto);
        }
    }

    class FinfindPageToDto extends app.wizard.business.page.PageToDto {
        constructor(self) {
            super(self);
        }

        apply(dto) {
            super.apply(dto);
        }
    }

    class Finfind extends app.wizard.business.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Finfind Business Profile Page';
        }

        enable(toggle) {
            super.enable(toggle);
        }

        clear() {
            super.clear();
        }

        validate(args, cb) {
            super.validate(args, (result) => {
                cb(result);
            })
        }

        addControls() {
            super.addControls();
        }

        addHandlers() {
            super.addHandlers();
        }

        notRegisteredHtml() {

            return 'Please note <b>finfind</b> requires a business to be registered (excluding sole proprietorships or partnerships).\
                     You can register on the CIPC website if you click <a href="http://www.cipc.co.za/" target="_blank" rel="noopener noreferrer">HERE</a>';

        }
    }

    page.getDtoToPage = function (self) {
        return new FinfindDtoToPage(self);
    }

    page.getPageToDto = function (self) {
        return new FinfindPageToDto(self);
    }

    page.create = function (id) {
        return new Finfind(id);
    }

    page.Finfind = Finfind;

})(app.wizard.business.page);
