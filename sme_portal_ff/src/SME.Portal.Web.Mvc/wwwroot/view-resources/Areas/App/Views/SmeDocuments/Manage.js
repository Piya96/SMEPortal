'use strict';

if (app.smeDoc == undefined) {
    app.smeDoc = {};
}

(function (smeDoc) {
    $(function () {

        "use strict";

        var fadingWizardBody = function (callBack) {
            var body = $('#sme-documents-wizard');
            body.fadeOut(500, 'swing', function () {
                body.fadeIn(500, 'swing');
                if (callBack)
                    callBack();
            });
        };


        // Class definition
        var KTWizardDocuments = function () {
            // Base elements
            var wizardEl;
            var formEl;
            var validator;
            var wizard;
            var validations = [];

            var _pageChangeCallback = null;

            // Private functions
            var initWizard = function () {
                // Initialize form wizard
                wizard = new KTWizard(
                    wizardEl, {
                    startStep: 1,
                    clickableSteps: true
                });

                // Change event
                wizard.on('change', function (_wizard) {
                    let currStep = _wizard.getStep();
                    let prev = _wizard.getStep();
                    let next = _wizard.getNewStep();
                    if (next < prev) {
                        if (_pageChangeCallback != null) {
                            _pageChangeCallback(prev - 1, next - 1);
                        }

                        fadingWizardBody(function() {
                            wizard.goPrev();
                            //KTUtil.scrollTop();
                        })
                        
                    } else {
                        //validations[currStep - 1].validate().then(function (status) {
                        //if (status == 'Valid') {
                        let prev = _wizard.getStep();
                        let next = _wizard.getNewStep();
                        if (_pageChangeCallback != null) {
                            _pageChangeCallback(prev - 1, next - 1);
                        }

                        fadingWizardBody(function () {
                            next > prev ? wizard.goNext() : wizard.goPrev();
                            //KTUtil.scrollTop();
                        })
                        
                        //} else {
                        //    Swal.fire({
                        //        text: "Sorry, looks like there are some errors detected, please try again.",
                        //        icon: "error",
                        //        buttonsStyling: false,
                        //        confirmButtonText: "Ok, got it!",
                        //        customClass: {
                        //            confirmButton: "btn font-weight-bold btn-light"
                        //        }
                        //    }).then(function () {
                        //        KTUtil.scrollTop();
                        //    });
                        //}
                        //});
                    }
                    wizard.stop();
                });
            }

            var initValidation = function () {

            }

            var initSubmit = function (submitCompleteFn) {
                let _submitCompleteFn = submitCompleteFn;
            }

            return {
                init: function (submitCompleteFn) {
                    wizardEl = KTUtil.getById('kt_wizard_documents');
                    formEl = KTUtil.getById('kt_form_documents');
                    initWizard();
                    initValidation();
                    initSubmit(submitCompleteFn);
                },
                setPageChangeCallback: function (pageChangeCallback) {
                    _pageChangeCallback = pageChangeCallback;
                },

                setStep: function (stepIndex) {
                    wizard.goTo(stepIndex + 1);
                }
            };
        }();

        KTWizardDocuments.init(null);
        KTWizardDocuments.setPageChangeCallback(null);

        $('#btn-submit').click(function () {
            window.location = "/app/smedocuments";
        });

        smeDoc.stepNext = function (stepIndex) {
            KTWizardDocuments.setStep(stepIndex);
        };
    })

})(app.smeDoc);

function onStepClick(stepIndex) {
    app.smeDoc.stepNext(stepIndex);
}
