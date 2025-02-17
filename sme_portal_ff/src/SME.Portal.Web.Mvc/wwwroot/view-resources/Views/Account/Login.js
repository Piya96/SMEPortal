var CurrentPage = function () {

    var handleLogin = function () {
        var $loginForm = $('form.login-form');
        var $submitButton = $('#kt_login_signin_submit');

        $submitButton.click(function () {
            trySubmitForm();
        });

        $loginForm.validate({
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            }
        });

        $loginForm.find('input').keypress(function (e) {
            if (e.which === 13) {
                trySubmitForm();
            }
        });

        $('a.social-login-icon').click(function () {
            var $a = $(this);
            var $form = $a.closest('form');
            $form.find('input[name=provider]').val($a.attr('data-provider'));
            $form.submit();
        });

        $loginForm.find('input[name=returnUrlHash]').val(location.hash);

        $('input[type=text]').first().focus();

        function trySubmitForm() {
            if (!$('form.login-form').valid()) {
                return;
            }
            abp.ui.setBusy(
                null,
                abp.ajax({
                    contentType: app.consts.contentTypes.formUrlencoded,
                    url: $loginForm.attr('action'),
                    data: $loginForm.serialize(),
                    abpHandleError: false
                }).fail(function (error) {
                    if(abp.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin') && typeof grecaptcha != "undefined"){
                        grecaptcha.reExecute();
                    }

                    if (error.message == 'UserInactive') {
                        location.href = '/Account/UserInactive/?userId=' + error.code.toString();
                    } else if (error.message == 'UserEmailIsNotConfirmed') {
                        function getTenantId() {
                            switch (error.details) {
                                case '3':
                                    //return 'https://sefa.finfind.co.za/Account/EmailActivation';
                                    return '/Account/EmailActivation';

                                case '5' :
                                    //return 'https://ecdc.finfind.co.za/Account/EmailActivation';
                                    return '/Account/EmailActivation';

                                default :
                                    //return 'https://app.finfind.co.za/Account/EmailActivation';
                                    return '/Account/EmailActivation';
                            }
                        }
                        let tenantId = getTenantId();
                        let form = document.createElement("div");
                        form.innerHTML =
                            "Your email address is not confirmed.Please check and click the email confirmation link to activate your account.\
                         If you did not receive activation email, click the 'send verification email' to request a new email.\
                         <br/><a target='_self' href='" + tenantId + "'><b>Send verification email</b></a>";

                        swal({
                            icon: 'error',
                            content: form
                        });
                    } else {
                        abp.ajax.showError(error);
                    }
                }).done((data) => {
                    if (data !== null && typeof data === 'object') {
                        if (data.hasOwnProperty('verb') == true) {
                            if (data['verb'] == 'UserInactive') {
                                location.href = '/Account/UserInactive/?userId=' + data.userId;
                            }
                        }
                    }
                    //location.href = '/Account/UserInactive/?userId=' + error.code.toString();
                    //let result = data;
                })
            );
        }
    }

    return {
        init: function () {
            handleLogin();
        }
    };

}();
