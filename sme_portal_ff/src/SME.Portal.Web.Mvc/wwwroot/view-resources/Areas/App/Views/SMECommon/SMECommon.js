"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.onboard == undefined) {
    app.onboard = {};
}

if (app.onboard.common == undefined) {
    app.onboard.common = {};
}

(function (common) {

    common.initMobileControls = function (arg) {
        arg.controls.mobileSelect = app.control.select2({
            name: arg.names.nameSelectProfileMobileVerify,
            id: arg.ids.idSelectProfileMobileVerify,
            value: 'key',
            text: 'text',
            ask: true
        });

        arg.controls.identityInput = app.control.input(
            arg.names.nameInputProfileIdentityVerify, arg.ids.idInputProfileIdentityVerify
        );

        arg.controls.identityButton = app.control.button(
            arg.names.nameInputButtonProfileIdentityVerify, arg.ids.idInputButtonProfileIdentityVerify
        );

        arg.controls.identityButtonSpan = app.control.base(
            arg.names.nameInputButtonSpanProfileIdentityVerify, arg.ids.idInputButtonSpanProfileIdentityVerify
        );

        arg.controls.mobileInput = app.control.input(
            arg.names.nameInputProfileMobileVerify, arg.ids.idInputProfileMobileVerify
        );

        arg.controls.mobileInput = app.control.input(
            arg.names.nameInputProfileMobileVerify, arg.ids.idInputProfileMobileVerify
        );

        arg.controls.mobileInputButton = app.control.button(
            arg.names.nameInputButtonProfileMobileVerify, arg.ids.idInputButtonProfileMobileVerify
        );

        arg.controls.mobileSelectButton = app.control.button(
            arg.names.nameSelectButtonProfileMobileVerify, arg.ids.idSelectButtonProfileMobileVerify
        );

        arg.controls.mobileInputButtonSpan = app.control.base(
            arg.names.nameInputButtonSpanProfileMobileVerify, arg.ids.idInputButtonSpanProfileMobileVerify
        );

        arg.controls.mobileSelectButtonSpan = app.control.base(
            arg.names.nameSelectButtonSpanProfileMobileVerify, arg.ids.idSelectButtonSpanProfileMobileVerify
        );

        arg.controls.mobileDivInput = app.control.base(
            arg.names.nameDivInputProfileMobileVerify, arg.ids.idDivInputProfileMobileVerify
        );

        arg.controls.mobileDivSelect = app.control.base(
            arg.names.nameDivSelectProfileMobileVerify, arg.ids.idDivSelectProfileMobileVerify
        );

        arg.controls.mobileInput.reset(function (id, name) {
            this.enable(false);
            this.showEx(true);
            this.val('');
            this.placeholder(null);

            arg.controls.mobileSelectButton.removeClass('pulse');
            arg.controls.mobileSelect.val('');
            arg.controls.mobileInputButton.showEx(true);
            arg.controls.mobileInputButton.enable(false);
            arg.controls.mobileInputButton.removeClass('pulse');
            arg.controls.mobileInputButtonSpan.text(app.localize('OW_IdentityVerifyButton'));
            arg.controls.mobileDivSelect.showEx(false);
            arg.controls.mobileDivInput.showEx(true);
        });
        arg.controls.mobileInput.reset();
    }


    common.activateMobileSelect = function(data, controls) {
        data.push({
            key: 'input',
            text: 'Mobile number not listed'
        });
        // TOTO: Remove!!!
        //data.push({
        //    key: '0829999999',
        //    text: '0829999999'
        //});
        controls.mobileSelect.fill(data);
        controls.mobileSelect.enable(true);
        controls.mobileDivSelect.showEx(true);
        controls.mobileDivInput.showEx(false);
        controls.mobileSelectButton.enable(false);
    }

    common.activateMobileInput = function(controls, cb) {
        controls.mobileDivSelect.showEx(false);
        controls.mobileDivInput.showEx(true);
        controls.mobileInput.enable(true);
        controls.mobileInput.placeholder('Enter your mobile number and click Verify');
        cb();
    }

    common.mobileSelectButtonClick = function (controls, cb) {
        controls.mobileSelectButton.enable(false);
        controls.mobileSelectButton.removeClass('pulse');
        let mobileNumber = controls.mobileSelect.val();
        //let mobileNumber = '0829999999';
        VerifyMobileNumber(mobileNumber, function (status) {
            app.onboard.wizard.toggleNext(true);

            function resultPass() {
                controls.mobileDivSelect.showEx(false);
                controls.mobileDivInput.showEx(true);
                controls.mobileInput.val(
                    controls.mobileSelect.val()
                );
                controls.mobileInput.enable(false);
                controls.mobileInputButton.removeClass('pulse');
                controls.mobileInputButton.enable(false);
                controls.mobileInputButtonSpan.text(app.localize('OW_IdentityVerifiedButton'));
                //_dto.owner.isPhoneNumberConfirmed = true;
            }

            function resultCancel() {
                controls.mobileSelectButton.enable(true);
                controls.mobileSelectButton.addClass('pulse');
            }

            function resultFail() {
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
            cb(status);
        });
    }

})(app.onboard.common);
