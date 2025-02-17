'use strict';

if (app.funderSearch == undefined) {
    app.funderSearch = {
        modal: {}
    };
}

jQuery(document).ready(function () {
    (function (modal) {

        //let formEl = KTUtil.getById('exampleModal');
        //let page = FormValidation.formValidation(
        //    formEl,
        //    {
        //        fields: {
        //            'company-select': {
        //                validators: {
        //                    validators: {
        //                        notEmpty: {
        //                            message: 'Select Funder Search Company'
        //                        }
        //                    }
        //                }
        //            }
        //        },
        //        plugins: {
        //            trigger: new FormValidation.plugins.Trigger(),
        //            bootstrap: new FormValidation.plugins.Bootstrap()
        //        }
        //    }
        //);
        let _cb = null;

        function OnStart(cb) {
            _cb = cb;
        }

        modal.onStart = OnStart;

        $('#id-funder-search-start-btn').prop('disabled', true);

        $('#company-select').change(function () {
            $('#id-funder-search-start-btn').prop('disabled', false);
        });

        $('#id-funder-search-start-btn').on('click', function () {
            let company = app.control.select('company-select');
            let companyId = company.val();
            if (companyId != null) {
                //let text = company.text();
                if (_cb != null) {
                    _cb(companyId);
                }
            }
        });
    }(app.funderSearch.modal));
});
