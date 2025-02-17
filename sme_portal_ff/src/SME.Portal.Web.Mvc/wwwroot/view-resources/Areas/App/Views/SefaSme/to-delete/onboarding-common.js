if (app.onboard == undefined) {
    app.onboard = {};
}
app.onboard.common = {};
(function (common) {
    if (common.button == undefined) {
        common.button = {};
    }

    function ButtonPulse(buttonId, textId, textState1, textState2) {
        let _pulse = false;
        let _disabled = false;

        function _disable_(toggle) {
            $('#' + buttonId).prop('disabled', toggle);
        }

        function _pulse_(toggle) {
            if (toggle == true) {
                $('#' + buttonId).addClass('pulse');
            } else {
                $('#' + buttonId).removeClass('pulse');
            }
        }

        function disable(toggle) {
            _disabled = toggle;
            _disable_(toggle);
        }

        function pulse(toggle) {
            _pulse = toggle;
            _pulse_(toggle);
        }

        function text(verified) {
            let textContent = verified == true
                ? app.localize(textState2)
                : app.localize(textState1);
            $('#' + textId).text(textContent);
        }

        function freeze(toggle) {
            _disable_(toggle == true ? true : _disabled);
            _pulse_(toggle == true ? false : _pulse);
        }

        function setState(_disable_, _pulse_, _verified_) {
            disable(_disable_);
            pulse(_pulse_);
            text(_verified_);
        }

        return {
            disable: disable,
            pulse: pulse,
            freeze : freeze,
            text: text,
            setState : setState
        };
    }

    common.button.pulse = ButtonPulse;

    // TODO: This is common to onboarding only.
    function VerifyMobile(id, mobileBtn, identityBtn, cb) {
        //app.onboard.wizard.toggleNext(false);
        mobileBtn.freeze(true);
        identityBtn.freeze(true);

        VerifyMobileNumber($('#' + id).val(), function (status) {
            app.onboard.wizard.toggleNext(true);
            identityBtn.freeze(false);

            function resultPass() {
                mobileBtn.setState(true, false, true);
                cb(status);
            }

            function resultCancel() {
                mobileBtn.freeze(false);
                cb(status);
            }

            function resultFail() {
                mobileBtn.freeze(false);
                cb(status);
            }

            switch (status.result) {
                case Result.Pass:
                    resultPass();
                    break;

                case Result.Cancel:
                    resultCancel();
                    break;

                case Result.Fail:
                    resultFail();
                    break;
            }
        });
    }
    if (common.verify == undefined) {
        common.verify = {};
    }
    common.verify.mobile = VerifyMobile;

    function VerifyIdentity(id, firstName, lastName, mobileBtn, identityBtn, cb, fail = false) {
        app.onboard.wizard.toggleNext(false);
        mobileBtn.freeze(true);
        identityBtn.freeze(true);
        sme.validate.id.verify(id, firstName, lastName, null, fail, function (http, status, jsonBlob) {

            app.onboard.wizard.toggleNext(true);
            mobileBtn.freeze(false);

            function resultPass() {
                identityBtn.setState(true, false, true);
                cb(status, jsonBlob);
            }

            function resultCancel() {
                identityBtn.freeze(false);
                cb(status, null);
            }

            function resultFail() {
                identityBtn.freeze(false);
                cb(status, null);
            }

            switch (status.result) {
                case Result.Pass:
                    resultPass();
                    break;

                case Result.Cancel:
                    resultCancel();
                    break;

                case Result.Fail:
                    resultFail();
                    break;
            }
        }, fail);
    }
    if (common.verify == undefined) {
        common.verify = {};
    }
    common.verify.identity = VerifyIdentity;

})(app.onboard.common);



if (typeof sme == 'undefined') {
    var sme = {};
}
// --- Add seetalert2 modal popups to global context.
sme.common = {
    // --- Removes all <option> elements from a <select> list.
    flushSelect: function (selectId) {
        alert('flushSelect:move to sme-common');
    },

    // --- Poplates <select> list with <option>textArr[...]</option> strings.
    // --- Defaults values to 0-based sequential increasing.
    fillSelect: function (selectId, textArr) {
        alert('fillSelect:move to sme-common');
    },

    fillSelect2: function (selectId, arr, name) {
        alert('fillSelect2:move to sme-common');
    },

    fillSelect_KeyValue: function (selectId, keyValueArr) {
        alert('fillSelect_KeyValue:move to sme-common');
    },

    getSelectText: function (selectId) {
        alert('getSelectText:move to sme-common');
    },

    fillDefaultIndustrySectorSelects: function (matrix) {
        alert('fillDefaultIndustrySectorSelects:move to sme-common');
    },

    getIndustryCategoryIndexs: function (key, matrix) {
        alert('getIndustryCategoryIndexs:move to sme-common');
    },

    getIndustryCategoryStrs: function (key, matrix) {
        alert('getIndustryCategoryStrs:move to sme-common');
    }
};

