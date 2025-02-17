'use strict';

if (typeof app === 'undefined') {
    var app = {};
}

if (app.common == undefined) {
    app.common = {};
}
app.common.landing = {};

(function (landing) {

    const FADE_SPEED = 500;

    function toggleNext(enable) {
        $('#Id-Form-Next').prop('disabled', enable ^ true);
    }

    function togglePrev(enable) {
        $('#Id-Form-Prev').prop('disabled', enable ^ true);
    }

    function showNext(show) {
        show == true ? $('#Id-Form-Next').fadeIn(FADE_SPEED, 'swing') : $('#Id-Form-Next').hide();
    }

    function showPrev(show) {
        show == true ? $('#Id-Form-Prev').fadeIn(FADE_SPEED, 'swing') : $('#Id-Form-Prev').hide();
    }

    let show = {
        landing : true,
        user: true,
        owner: true,
        company: true
    };

    function onInfoButtonClick(pageDivId, infoDivId, buttonId, name) {
        $(buttonId).on('click', function () {
            if (show[name] == true) {
                show[name] = false;
                $(buttonId).prop('disabled', true);
                $(buttonId).removeClass('pulse2');
                if (name == 'landing') {
                    showNext(false);
                    showPrev(false);
                    $('#Id-Form-Next').click();
                } else {
                    $(infoDivId).fadeOut(FADE_SPEED, 'swing', function () {
                        if (name == 'user') {
                            showNext(true);
                            showPrev(false);
                        } else {
                            showNext(true);
                            showPrev(true);
                        }
                        $(pageDivId).fadeIn(FADE_SPEED, 'swing', function () {
                        });
                    });
                }
            }
        });
    }

    onInfoButtonClick('#id-landing-profile-div', '#id-landing-info-message-div', '#id-landing-info-message-button', 'landing');
    onInfoButtonClick('#id-user-profile-div', '#id-user-info-message-div', '#id-user-info-message-button', 'user');
    onInfoButtonClick('#id-owner-profile-div', '#id-owner-info-message-div', '#id-owner-info-message-button', 'owner');
    onInfoButtonClick('#id-company-profile-div', '#id-company-info-message-div', '#id-company-info-message-button', 'company');

    landing.attention = function (infoDivId, buttonId, name, cb = null) {
        return;
        if (app.onboard.wizard.mode != app.onboard.wizard.MODE.Normal) {
            $('#id-company-profile-div').fadeIn(FADE_SPEED, 'swing', function () {
            });
            return;
        }
        if (show[name] == true) {
            $(infoDivId).show();
            $(buttonId).prop('disabled', false);
            $(buttonId).addClass('pulse2');
            if (name != 'landing') {
                showPrev(false);
                showNext(false);
            }
        } else {
            showPrev(true);
            showNext(true);
        }
    };

    landing.neglect = function (infoDivId, buttonId, name, cb = null) {
        return;
        if (app.onboard.wizard.mode != app.onboard.wizard.MODE.Normal) {
            return;
        }
        showPrev(false);
        showNext(false);
    };

}(app.common.landing));
