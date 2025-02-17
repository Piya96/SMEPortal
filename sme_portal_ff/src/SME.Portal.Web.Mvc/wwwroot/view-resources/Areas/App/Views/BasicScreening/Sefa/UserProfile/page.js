"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.user == undefined) {
    app.wizard.user = {};
}

if (app.wizard.user.page == undefined) {
    app.wizard.user.page = {};
}

(function (page) {

    let guids = {
        SefaOriginOther: '6321dbc1eb41fff5d2cf4114',
        SefaOriginStrategicPartner: '6321db9f186caf8814235ebd'
    };

    class DtoToPage_Sefa extends page.DtoToPage {
        constructor(self) {
            super(self);
        }

        howDidYouHearAboutSefa() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'how-did-you-hear-about-sefa', '');
            this.controls['select-how-did-you-hear-about-sefa'].val(value);
            this.howDidYouHearAboutSefa_StrategicPartner(value == guids.SefaOriginStrategicPartner);
            this.howDidYouHearAboutSefa_Other(value == guids.SefaOriginOther);
        }

        howDidYouHearAboutSefa_StrategicPartner(enable) {
            this.helpers.show('div-user-profile-sefa-origin-strategic-partner', enable);
            this.set('select-user-profile-sefa-origin-strategic-partner', 'how-did-you-hear-about-sefa-strategic-partner', enable);
        }

        howDidYouHearAboutSefa_Other(enable) {
            this.helpers.show('div-user-profile-sefa-origin-other', enable);
            this.set('input-user-profile-sefa-origin-other', 'how-did-you-hear-about-sefa-other', enable);
        }

        apply(dto) {
            super.apply(dto);
            this.howDidYouHearAboutSefa();
        }
    }

    class PageToDto_Sefa extends page.PageToDto {
        constructor(self) {
            super(self);
        }

        get(name, prop, show) {
            if (show == true) {
                let value = this.controls[name].val();
                this.helpers.setPropEx(this.dto.propertiesJson, prop, value);
            }
        }

        howDidYouHearAboutSefa() {
            let value = this.controls['select-how-did-you-hear-about-sefa'].val();
            this.helpers.setPropEx(this.dto.propertiesJson, 'how-did-you-hear-about-sefa', value);
            this.howDidYouHearAboutSefa_StrategicPartner(value == guids.SefaOriginStrategicPartner);
            this.howDidYouHearAboutSefa_Other(value == guids.SefaOriginOther);
        }

        howDidYouHearAboutSefa_StrategicPartner(enable) {
            this.get('select-user-profile-sefa-origin-strategic-partner', 'how-did-you-hear-about-sefa-strategic-partner', enable);
        }

        howDidYouHearAboutSefa_Other(enable) {
            this.get('input-user-profile-sefa-origin-other', 'how-did-you-hear-about-sefa-other', enable);
        }

        apply(dto) {
            super.apply(dto);
            this.howDidYouHearAboutSefa();
        }
    }

    class Sefa extends app.wizard.user.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Sefa User Profile Page';
        }

        createDtoToPage() {
            return new DtoToPage_Sefa(this);
        }

        createPageToDto() {
            return new PageToDto_Sefa(this);
        }

        addControls() {
            super.addControls();

            let control = null;
            let arr = null;

            control = this.addControl('select-how-did-you-hear-about-sefa', 'select');
            arr = this.listItems.getSefaOrigin();
            control.fill(arr);
            control = this.addControl('select-user-profile-sefa-origin-strategic-partner', 'select');
            arr = this.listItems.getSefaOriginStrategicPartner();
            control.fill(arr);
            control = this.addControl('input-user-profile-sefa-origin-other', 'input');
        }

        addHandlers() {
            super.addHandlers();
            let self = this;
            this.controls['select-how-did-you-hear-about-sefa'].change((value, text) => {
                self.helpers.setPropEx(self.model['propertiesJson'], 'how-did-you-hear-about-sefa', '');
                self.dto2Page.howDidYouHearAboutSefa_StrategicPartner(value == guids.SefaOriginStrategicPartner);
                self.dto2Page.howDidYouHearAboutSefa_Other(value == guids.SefaOriginOther);
            });
        }

        attention(args, cb) {
            super.attention(args, cb);
            initAutocomplete_user();
        }
    }

    page.create = function (id) {
        return new Sefa(id);
    }

    page.Sefa = Sefa;

})(app.wizard.user.page);
