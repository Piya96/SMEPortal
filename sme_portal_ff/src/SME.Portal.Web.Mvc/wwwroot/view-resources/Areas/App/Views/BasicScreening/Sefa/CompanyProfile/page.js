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
    const IN_BUSINESS = '03';
    const NOT_REGISTERED = 'NotRegistered';
    const SOLE_PROPRITETOR = '5a6ab7ce506ea818e04548ad';
    const PARTNERSHIP = '5a6ab7d3506ea818e04548b0';
    const NOT_REGISTERED_TEXT = 'Business not registered';

    class DtoToPage_Sefa extends app.wizard.business.page.DtoToPage {
        constructor(self) {
            super(self);
        }

        entityType() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'entityType', '');
            this.controls['select-entity-type'].val(value);
        }

        apply(dto) {
            super.apply(dto);
            this.entityType();
        }
    }

    class PageToDto_Sefa extends app.wizard.business.page.PageToDto {
        constructor(self) {
            super(self);
        }

        entityType() {
            let value = this.controls['select-entity-type'].val();
            this.helpers.setPropEx(this.dto.propertiesJson, 'entityType', value);
        }

        apply(dto) {
            super.apply(dto);
            this.entityType();
        }
    }

    class Sefa extends app.wizard.business.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Sefa Business Profile Page';
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
            let control = null;
            let arr = null;
            control = this.addControl('select-entity-type', 'select');
            arr = this.listItems.getEntityTypes();
            control.fill(arr);
        }

        addHandlers() {
            super.addHandlers();
        }

        populateCompanyType_NotRegistered(obj, type, arr) {
            if (type == SOLE_PROPRITETOR || type == PARTNERSHIP) {
                arr.push({
                    value: type,
                    text: obj['text']
                });
            }
        }

        notRegisteredHtml() {
            return 'Please note <b>Sefa</b> requires a business to be registered (excluding sole proprietorships or partnerships).\
                     You can register on the CIPC website if you click <a href="http://www.cipc.co.za/" target="_blank" rel="noopener noreferrer">HERE</a>';
        }

        onCompanySelectClick(value) {
            let self = this;
            if (value == NOT_REGISTERED) {
                Swal.fire({
                    icon: 'info',
                    html: self.notRegisteredHtml(),
                    focusConfirm: false,
                    confirmButtonText:
                        '<i class="fa fa-thumbs-up"></i> Great!',
                    confirmButtonAriaLabel: 'Thumbs up, great!'
                }).then(() => {
                    super.onCompanySelectClick(value);
                });
            } else {
                super.onCompanySelect(value);
            }
        }

        addCustomCompanies(data) {
            function addCustom(key, value) {
                data.push({
                    companyName: '',
                    companyType: '',
                    status: IN_BUSINESS,
                    registrationNumber: '',
                    'key': key,
                    'value': value
                });
            }
            addCustom(NOT_REGISTERED, NOT_REGISTERED_TEXT);
        }
    }

    page.getDtoToPage = function (self) {
        return new DtoToPage_Sefa(self);
    }

    page.getPageToDto = function (self) {
        return new PageToDto_Sefa(self);
    }

    page.create = function (id) {
        return new Sefa(id);
    }

    page.Sefa = Sefa;

})(app.wizard.business.page);
