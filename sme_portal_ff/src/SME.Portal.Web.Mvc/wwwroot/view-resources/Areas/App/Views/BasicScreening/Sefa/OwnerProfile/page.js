"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.owner == undefined) {
    app.wizard.owner = {};
}

if (app.wizard.owner.page == undefined) {
    app.wizard.owner.page = {};
}

(function (page) {

    class DtoToPage_Sefa extends page.DtoToPage {
        constructor(self) {
            super(self);
        }

        isDisabled() {
            this.set('input-owner-is-disabled', 'owner-is-disabled', true);
        }

        apply(dto) {
            super.apply(dto);
            this.isDisabled();
        }
    }

    class PageToDto_Sefa extends page.PageToDto {
        constructor(self) {
            super(self);
        }

        get(name, prop, show) {
            if (show == true) {
                let value = this.controls[name].val();
                this.helpers.setPropEx(this.dto.propertiesJson, prop, value);
            }
        }

        isDisabled() {
            this.get('input-owner-is-disabled', 'owner-is-disabled', true);
        }

        apply(dto) {
            super.apply(dto);
            this.isDisabled();
        }
    }


    class Sefa extends app.wizard.owner.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Sefa Owner Profile Page';
        }

        createDtoToPage() {
            return new DtoToPage_Sefa(this);
        }

        createPageToDto() {
            return new PageToDto_Sefa(this);
        }

        addControls() {
            super.addControls();
            let control = null;
            control = this.addControl('input-owner-is-disabled', 'radio');
            control = this.addControl('input-owner-profile-race-other', 'input');

            this.helpers.show('div-profile-registered-address', true);
        }

        addHandlers() {
            super.addHandlers();
        }

        attention(args, cb) {
            super.attention(args, cb);
            initAutocomplete_owner();
        }
    }

    page.create = function (id) {
        return new Sefa(id);
    }
})(app.wizard.owner.page);
