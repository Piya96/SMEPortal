"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.companyInfo == undefined) {
    app.wizard.companyInfo = {};
}

if (app.wizard.companyInfo.dto == undefined) {
    app.wizard.companyInfo.dto = {};
}

(function (dto) {

    let productGuids = app.wizard.common.page.productGuids;

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    dto.controls = {
        'input-total-number-of-owners': { type: 'input', label: 'Total number of owners', filters: {} },

        'input-percent-ownership-by-south-africans': { type: 'input', label: 'Total ownership by South Africans', filters: {} },
        'input-percent-black-coloured-indian-pdi': { type: 'input', label: 'Number of Black, Coloured, and Indian (combined owners total)', filters: {} },
        'input-percent-black-south-africans-only': { type: 'input', label: 'Total number of black only owners', filters: {} },
        'input-percent-white-only': { type: 'input', label: 'Total number of white only owners', filters: {} },
        'input-percent-asian-only': { type: 'input', label: 'Total number of Asian only owners', filters: {} },
        'input-percent-disabled-people': { type: 'input', label: 'Total number of owners with disability (any race)', filters: {} },
        'input-percent-youth-under-35': { type: 'input', label: 'Total number of young owners under 35 years of age (any race)', filters: {} },
        'input-percent-women-women-any-race': { type: 'input', label: 'Total number of female owners (any race)', filters: {} },
        'input-percent-women-black-only': { type: 'input', label: 'Total number of female owners (black only)', filters: {} },
        // *** Product
        'input-military-veteran-owners': { type: 'input', label: 'Total number of military veteran owners', filters: {} },

        'input-percent-non-south-african-citizens': { type: 'input', label: 'Total number of Non-SA citizen owners', filters: {} },
        // *** Product
        'input-percent-companies-organisations': { type: 'input', label: 'Total number of Business/organisations (non-individuals) owners', filters: {} },
        // *** Product
        'select-company-profile-bee-level': { type: 'select', guid: '5af27ffb7fbbb21e6817bc41', label: 'What is your BEE level?', filters: [listItems.getBeeLevel.bind(listItems)] },

        'input-total-number-of-employees': { type: 'input', label: 'Total number of employees (permanent and part-time)', filters: {} },
        'input-registered-for-coida': { type: 'radio', label: 'Are you registered for COIDA?', filters: {} },

        'input-number-of-permanent-employees': { type: 'input', label: 'Number of current permanent employees', filters: {} },
        'input-number-of-permanent-youth-employees-under35': { type: 'input', label: 'Number of permanent youth employees under 35', filters: {} },
        'input-number-of-permanent-female-employees': { type: 'input', label: 'Number of permanent female employees', filters: {} },
        'input-number-of-permanent-black-employees': { type: 'input', label: 'Number of permanent black employees', filters: {} },
        // *** Product
        'input-number-of-permanent-non-sa-employees': { type: 'input', label: 'Number of non South African permanent employees', filters: {} },
        // *** Product
        'input-number-of-permanent-disabled-employees': { type: 'input', label: 'Number of disabled permanent employees', filters: {} },
        'input-number-of-new-jobs-created-through-loan': { type: 'input', label: 'Number of new jobs to be created through this loan', filters: {} },
        'input-number-of-existing-jobs-sustained': { type: 'input', label: 'Number of existing jobs sustained', filters: {} },

        'input-number-of-part-time-employees': { type: 'input', label: 'Number of current part time  employees', filters: {} },
        'input-number-of-part-time-youth-employees-under35': { type: 'input', label: 'Number of part time  youth employees under 35', filters: {} },
        'input-number-of-part-time-female-employees': { type: 'input', label: 'Number of part time  female employees', filters: {} },
        'input-number-of-part-time-black-employees': { type: 'input', label: 'Number of part time  black employees', filters: {} },
        // *** Product
        'input-number-of-part-time-non-sa-employees': { type: 'input', label: 'Number of non South African part-time employees', filters: {} },
        // *** Product
        'input-number-of-part-time-disabled-employees': { type: 'input', label: 'Number of disabled part-time employees', filters: {} },
        'input-number-of-new-part-time-jobs-created-through-loan': { type: 'input', label: 'Number of new part time jobs to be created through this loan', filters: {} },
        'input-number-of-existing-part-time-jobs-sustained': { type: 'input', label: 'Number of existing part time jobs sustained', filters: {} }
    };

    function fn1(value) {
        return value;
    }

    class DtoToHtml {
        constructor(self) {
            this.self = self;
            this.total = 0;
            this.fn1 = null;
            this.o = {};
        }

        set(name, show, fn = []) {
            let value = '';
            value = helpers.getPropEx(this.dto, name, '');
            if (value == null || value == undefined) {
                value == '';
            }
            fn.forEach((f, idx) => {
                value = f(value);
            });
            return value;
        }

        show(div, name, show) {
            if (div != '') {
                if (show == true) {
                    $('#' + div).show('fast');
                } else {
                    $('#' + div).hide('fast');
                }
            }
            if (name != '') {
                this.self.validation.toggleValidators([name], [show]);
            }
        }

        showBeeLevel() {
            return true;
        }

        beeLevel() {
            let enable = this.showBeeLevel();
            this.set('select-company-profile-bee-level', enable);
            this.show('div-bee-level', 'select-company-profile-bee-level', enable);
        }

        totalNumberOfEmployees() {
            let value = this.set('input-total-number-of-employees', true);
            value = parseInt(value);
            this.registeredForCoida(value > 0);
        }

        registeredForCoida(show) {
            if (show == true) {
                this.set('input-registered-for-coida', true);
                $('#div-registered-for-coida').show();
            } else {
                this.set('input-registered-for-coida', true);
                $('#div-registered-for-coida').hide();
            }
        }

        totalNumberOfPermanentEmployees() {
            this.set('input-number-of-permanent-employees', true);
        }

        totalNumberOfPermanentYouthEmployeesUnder35() {
            this.set('input-number-of-permanent-youth-employees-under35', true);
        }

        totalNumberOfPermanentFemaleEmployees() {
            this.set('input-number-of-permanent-female-employees', true);
        }

        totalNumberOfPermanentBlackEmployees() {
            this.set('input-number-of-permanent-black-employees', true);
        }

        showTotalNumberOfPermanentNonSAEmployees() {
            return true;
        }

        totalNumberOfPermanentNonSAEmployees() {
            let enable = this.showTotalNumberOfPermanentNonSAEmployees();
            this.set('input-number-of-permanent-non-sa-employees', enable);
            this.show('div-permanent-non-sa-employees', 'input-number-of-permanent-non-sa-employees', enable);
        }

        showTotalNumberOfPermanentDisabledEmployees() {
            return true;
        }

        totalNumberOfPermanentDisabledEmployees() {
            let enable = this.showTotalNumberOfPermanentDisabledEmployees();
            this.set('input-number-of-permanent-disabled-employees', enable);
            this.show('div-permanent-disabled-employees', 'input-number-of-permanent-disabled-employees', enable);
        }

        totalNumberOfNewJobsCreatedThroughLoan() {
            this.set('input-number-of-new-jobs-created-through-loan', true);
        }

        totalNumberOfExistingJobsSustained() {
            this.set('input-number-of-existing-jobs-sustained', true);
        }

        totalNumberOfPartTimeEmployees() {
            this.set('input-number-of-part-time-employees', true);
        }

        totalNumberOfPartTimeYouthEmployeesUnder35() {
            this.set('input-number-of-part-time-youth-employees-under35', true);
        }

        totalNumberOfPartTimeFemaleEmployees() {
            this.set('input-number-of-part-time-female-employees', true);
        }

        totalNumberOfPartTimeBlackEmployees() {
            this.set('input-number-of-part-time-black-employees', true);
        }

        showTotalNumberOfPartTimeNonSAEmployees() {
            return true;
        }

        totalNumberOfPartTimeNonSAEmployees() {
            let enable = this.showTotalNumberOfPartTimeNonSAEmployees();
            this.set('input-number-of-part-time-non-sa-employees', enable);
            this.show('div-part-time-non-sa-employees', 'input-number-of-part-time-non-sa-employees', enable);
        }

        showTotalNumberOfPartTimeDisabledEmployees() {
            return true;
        }

        totalNumberOfPartTimeDisabledEmployees() {
            let enable = this.showTotalNumberOfPartTimeDisabledEmployees();
            this.set('input-number-of-part-time-disabled-employees', enable);
            this.show('div-part-time-disabled-employees', 'input-number-of-part-time-disabled-employees', enable);
        }

        totalNumberOfNewPartTimeJobsCreatedThroughLoan() {
            this.set('input-number-of-new-part-time-jobs-created-through-loan', true);
        }

        totalNumberOfExistingPartTimeJobsSustained() {
            this.set('input-number-of-existing-part-time-jobs-sustained', true);
        }

        totalNumberOfOwners() {
            this.total = this.set('input-total-number-of-owners', true);
            this.o.def = '';
            this.o.val = '';
            this.o.tot = this.total;
            this.fn1 = fn1.bind(this.o);
        }

        percentOwnershipBySouthAfricans() {
            this.set('input-percent-ownership-by-south-africans', true, [this.fn1]);
        }

        percentBlackColouredIndianPdi() {
            this.set('input-percent-black-coloured-indian-pdi', true, [this.fn1]);
        }

        percentBlackSouthAfricansOnly() {
            this.set('input-percent-black-south-africans-only', true, [this.fn1]);
        }

        percentWhiteOnly() {
            this.set('input-percent-white-only', true, [this.fn1]);
        }

        percentAsianOnly() {
            this.set('input-percent-asian-only', true, [this.fn1]);
        }

        percentDisabledPeople() {
            this.set('input-percent-disabled-people', true, [this.fn1]);
        }

        percentYouthUnder35() {
            this.set('input-percent-youth-under-35', true, [this.fn1]);
        }

        percentWomenWomenAnyRace() {
            this.set('input-percent-women-women-any-race', true, [this.fn1]);
        }

        percentWomenBlackOnly() {
            this.set('input-percent-women-black-only', true, [this.fn1]);
        }

        showNumberOfMilitaryVeterans() {
            return true;
        }

        numberOfMilitaryVeterans() {
            let enable = this.showNumberOfMilitaryVeterans();
            this.set('input-military-veteran-owners', enable, [this.fn1]);
            this.show('div-military-veteran-owners', 'input-military-veteran-owners', enable);
        }

        percentNonSouthAfricanCitizens() {
            this.set('input-percent-non-south-african-citizens', true, [this.fn1]);
        }

        showPercentCompaniesOrganisations() {
            return true;
        }

        percentCompaniesOrganisations() {
            let enable = this.showPercentCompaniesOrganisations();
            this.set('input-percent-companies-organisations', enable, [this.fn1]);
            this.show('div-total-companies-organisations', 'input-percent-companies-organisations', enable);
        }

        apply(dto) {
            this.dto = dto;

            this.productGuid = helpers.getPropEx(this.self.dto, 'input-product-guid', '');

            this.totalNumberOfOwners();
            this.percentOwnershipBySouthAfricans();
            this.percentBlackColouredIndianPdi();
            this.percentBlackSouthAfricansOnly();
            this.percentWhiteOnly();
            this.percentAsianOnly();
            this.percentDisabledPeople();
            this.percentYouthUnder35();
            this.percentWomenWomenAnyRace();
            this.percentWomenBlackOnly();
            // ECDC
            this.numberOfMilitaryVeterans();
            this.percentNonSouthAfricanCitizens();
            this.percentCompaniesOrganisations();

            this.beeLevel();

            this.totalNumberOfEmployees();

            this.totalNumberOfPermanentEmployees();
            this.totalNumberOfPermanentYouthEmployeesUnder35();
            this.totalNumberOfPermanentFemaleEmployees();
            this.totalNumberOfPermanentBlackEmployees();
            // ECDC
            this.totalNumberOfPermanentNonSAEmployees();
            this.totalNumberOfPermanentDisabledEmployees();
            this.totalNumberOfNewJobsCreatedThroughLoan();
            this.totalNumberOfExistingJobsSustained();

            this.totalNumberOfPartTimeEmployees();
            this.totalNumberOfPartTimeYouthEmployeesUnder35();
            this.totalNumberOfPartTimeFemaleEmployees();
            this.totalNumberOfPartTimeBlackEmployees();
            // ECDC
            this.totalNumberOfPartTimeNonSAEmployees();
            this.totalNumberOfPartTimeDisabledEmployees();
            this.totalNumberOfNewPartTimeJobsCreatedThroughLoan();
            this.totalNumberOfExistingPartTimeJobsSustained();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml(dto);
    }

    dto.DtoToHtml = DtoToHtml;

})(app.wizard.companyInfo.dto);
