'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.user == undefined) {
    app.fss.user = {};
}

(function (user) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    let guids = {
        SefaOriginOther: '6321dbc1eb41fff5d2cf4114',
        SefaOriginStrategicPartner: '6321db9f186caf8814235ebd'
    };

    class Sefa extends app.fss.user.Baseline {
        constructor() {
            super();
        }

        whereDidYouHearAboutSefa() {
            let value = this.set('td-how-did-you-hear-about-sefa', 'how-did-you-hear-about-sefa', true, [listItems.getSefaOrigin.bind(listItems)]);
            this.whereDidYouHearAboutSefa_StrategicPartners(value == guids.SefaOriginStrategicPartner);
            this.whereDidYouHearAboutSefa_Other(value == guids.SefaOriginOther);
        }

        whereDidYouHearAboutSefa_StrategicPartners(show) {
            let value = this.set('td-user-profile-sefa-origin-strategic-partner', 'how-did-you-hear-about-sefa-strategic-partner', show, [listItems.getSefaOriginStrategicPartner.bind(listItems)]);
            helpers.show('tr-user-profile-sefa-origin-strategic-partner-' + this.appId, show);
        }

        whereDidYouHearAboutSefa_Other(show) {
            let value = this.set('td-user-profile-sefa-origin-other', 'how-did-you-hear-about-sefa-other', show, []);
            helpers.show('tr-user-profile-sefa-origin-other-' + this.appId, show);
        }

        apply(dto, appId) {
            super.apply(dto, appId);
            this.whereDidYouHearAboutSefa();
        }
    }

    user.create = function () {
        return new Sefa();
    }

    user.Sefa = Sefa;

}(app.fss.user));
