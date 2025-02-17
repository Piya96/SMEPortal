"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.lenderDocuments == undefined) {
    app.wizard.lenderDocuments = {};
}

if (app.wizard.lenderDocuments.page == undefined) {
    app.wizard.lenderDocuments.page = {};
}

(function (page) {

    class FinfindLenderDocumentsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Finfind Lender Documents Page';
        }

        dtoToPage(dto) {
            super.dtoToPage(dto);
            for (let i = 0; i < 22; i++) {
                let name = 'one' + (i + 1).toString();
                let value = this.helpers.getPropEx(dto, name, '');
                this.controls[name].val(value);
            }
        }

        load(args, cb) {
            self = this;
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            //this.dto2Page = new DtoToPage(this);
            this.dtoToPage(this.dto);
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
                let dto = this.helpers.nvpArrayToObject(mc);
                this.dtoToPage(dto);
            }
            cb(app.wizard.addResult());
        }

        addControls() {
            super.addControls();

            let control = null;
            for (let i = 0; i < 22; i++) {
                let name = 'one' + (i + 1).toString();
                control = this.addControl(name, 'radio');
            }
        }

        addHandlers() {
            let self = this;
        }
    }

    page.create = function (id) {
        return new FinfindLenderDocumentsPage(id);
    }

    page.FinfindLenderDocuments = FinfindLenderDocumentsPage;

    page.Finfind = FinfindLenderDocumentsPage;

})(app.wizard.lenderDocuments.page);
