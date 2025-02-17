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

    class Base {
        constructor (id) {
            this.name = 'Wizard Base Page';
            this.id = id;
    
            this.validation = null;
    
            this.data = {
                idDirty : null,
                dto : null
            };
            this.listItems = app.listItems.get();
            this.helpers = app.onboard.helpers.get();
            this.model = null;
            this.controls = {};
            this.common = null;
            this.cb = null;
        }

        __ValidateInitArgs__ (args) {
            return true;
        }

        getJson() {
        }

        init(args) {
            if(this.__ValidateInitArgs__(args) == false) {
                return false;
            } else {
                this.validation = args['validator'];
                if (args.hasOwnProperty('common') == true) {
                    this.common = args['common'];
                }
                if (args.hasOwnProperty('cb') == true) {
                    this.cb = args['cb'];
                }
                this.addControls();
                this.addHandlers();
                return true;
            }
        }

        // Implement this abstract base method to populate page controls from the dto.
        dtoToPage () {
        }

        // Implement this abstract base method to populate the dto from the page controls.
        pageToDto () {
        }

        // Implement this abstract base method to populate the dto from the page controls.
        copyDto (srcDto) {
        }

        // Implement this abstract base method to load and populate page controls.
        reset () {
        }

        // Implement this abstract base method to load and populate page controls.
        load (data, cb) {
            cb(app.wizard.addResult());
        }

        // Implement this abstract base method to get and save page data.
        save (cb) {
            cb(app.wizard.addResult());
        }

        // Implement this abstract base method to serialize form data into an array of {name,value} object.
        serialize() {
            let arr = [];
            for (const name in this.controls) {
                let val = [];
                if (this.controls[name].type == 'checkbox') {
                    val = this.controls[name].getAll(true)
                } else if (this.controls[name].type == 'selectmulti') {
                    let arr = this.controls[name].valEx();
                    arr.forEach((o, i) => {
                        val.push(o);
                    });
                } else {
                    val.push(this.controls[name].val());
                }
                val.forEach((item, index) => {
                    if (item != null) {
                        arr.push({
                            name: this.controls[name].name,
                            value: item
                        });
                    }
                });
            }
            return arr;
        }

        remap(nvp) {
            return [];
        }

        attentionHidden(args, cb) {
            cb(app.wizard.addResult());
        }

        neglectHidden(args, cb) {
            cb(app.wizard.addResult());
        }

        attention (args, cb) {
            cb(app.wizard.addResult());
        }

        neglect (args, cb) {
            cb(app.wizard.addResult());
        }

        validate(args, cb) {
            cb(app.wizard.addResult());
        }

        formValidationError(result, cb) {
            cb(app.wizard.addResult());
        }

        // Override this method to toggle validations specific to your page.
        // Any derived method should NOT invoke the base method. This is meant as an abstract base method.
        onValidateField (field, isValid, args = null) {
        }

        // Override this method to add validations specific to this page.
        // This is meant as an abstract base method. Invoking it would be pointless.
        addControls () {
        }

        // Override this method to add validations specific to this page.
        // This is meant as an abstract base method. Invoking it would be pointless.
        addHandlers () {
        }

        addControl(name, type) {
            return this.addControl2(name, name, type);
        }

        addControl2(id, name, type) {
            switch (type) {
                case 'input':
                    this.controls[name] = app.control.input(name, id);
                    break;

                case 'select':
                    this.controls[name] = app.control.select(name, id);
                    break;

                case 'selectmulti':
                    this.controls[name] = app.control.selectmulti(name, id);
                    break;

                case 'radio':
                    this.controls[name] = app.control.radio(name, id);
                    break;

                case 'checkbox':
                    this.controls[name] = app.control.checkbox(name, id);
                    break;

                case 'date':
                    this.controls[name] = app.control.date(name, id);
                    break;

                case 'button':
                    this.controls[name] = app.control.button(name, id);
                    break;

                default:
                    return null;
            }
            return this.controls[name];
        }

        showControlDiv(divId, elemIds, show) {
            this.validation.toggleValidators(elemIds, [show]);
            this.helpers.show(divId, show);
        }
    }

    page.getBase = function (id) {
        return new Base(id);
    }

    page.Base = Base;

})(app.wizard.page);
