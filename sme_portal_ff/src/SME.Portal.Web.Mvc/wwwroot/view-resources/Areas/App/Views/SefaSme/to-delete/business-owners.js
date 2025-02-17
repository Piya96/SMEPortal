//function onboardingLoadBusinessOwners() {

    if (app.onboard == undefined) {
        app.onboard = {};
    }

    app.onboard.businessOwners = {};

    (function (businessOwners) {

        let _controlMap = new Map();

        const nameinputtotalnumberofowners = "name-input-total-number-of-owners";
        const nameinputhowmanyaresouthafricans = "name-input-how-many-are-south-africans";
        const nameinputhowmanyarenotsouthafricans = "name-input-how-many-are-not-south-africans";
        const nameinputhowmanyarecompaniesorganisations = "name-input-how-many-are-companies-organisations";
        const nameinputblackcolouredindianpdi = "name-input-black-coloured-indian-pdi";
        const nameinputblackonly = "name-input-black-only";
        const nameinputwomenanyrace = "name-input-women-any-race";
        //const nameinputwomenpdi = "name-input-women-pdi";
        const nameinputwomenblackonly = "name-input-women-black-only";
        const nameinputdisabledanyrace = "name-input-disabled-any-race";
        const nameinputyouthunder35anyrace = "name-input-youth-under-35-any-race";

        _controlMap.set(nameinputtotalnumberofowners, { control: app.control.input(nameinputtotalnumberofowners) } );
        _controlMap.set(nameinputhowmanyaresouthafricans, { control: app.control.input(nameinputhowmanyaresouthafricans) });
        _controlMap.set(nameinputhowmanyarenotsouthafricans, { control: app.control.input(nameinputhowmanyarenotsouthafricans) });
        _controlMap.set(nameinputhowmanyarecompaniesorganisations, { control: app.control.input(nameinputhowmanyarecompaniesorganisations) });
        _controlMap.set(nameinputblackcolouredindianpdi, { control: app.control.input(nameinputblackcolouredindianpdi) });
        _controlMap.set(nameinputblackonly, { control: app.control.input(nameinputblackonly) });
        _controlMap.set(nameinputwomenanyrace, { control: app.control.input(nameinputwomenanyrace) });
        //_controlMap.set(nameinputwomenpdi, { control: app.control.input(nameinputwomenpdi) });
        _controlMap.set(nameinputwomenblackonly, { control: app.control.input(nameinputwomenblackonly) });
        _controlMap.set(nameinputdisabledanyrace, { control: app.control.input(nameinputdisabledanyrace) });
        _controlMap.set(nameinputyouthunder35anyrace, { control: app.control.input(nameinputyouthunder35anyrace) });

        const jsonToName = {
            'numberofowners': nameinputtotalnumberofowners,
            'southafricanownedpercentage': nameinputhowmanyaresouthafricans,
            'nonsouthafricanownedpercentage': nameinputhowmanyarenotsouthafricans,
            'companyownedpercentage': nameinputhowmanyarecompaniesorganisations,
            'blackallownedpercentage': nameinputblackcolouredindianpdi,
            'blackownedpercentage': nameinputblackonly,
            'womenownedpercentage': nameinputwomenanyrace,
            //'blackwomenownedpercentage': nameinputwomenpdi,
            'womenblackonlypercentage': nameinputwomenblackonly,
            'disabledownedpercentage': nameinputdisabledanyrace,
            'youthownedpercentage': nameinputyouthunder35anyrace
        };

        const nameToJson = {
            'name-input-total-number-of-owners': 'numberofowners',
            'name-input-how-many-are-south-africans': 'southafricanownedpercentage',
            'name-input-how-many-are-not-south-africans': 'nonsouthafricanownedpercentage',
            'name-input-how-many-are-companies-organisations': 'companyownedpercentage',
            'name-input-black-coloured-indian-pdi': 'blackallownedpercentage',
            'name-input-black-only': 'blackownedpercentage',
            'name-input-women-any-race': 'womenownedpercentage',
            //'name-input-women-pdi': 'blackwomenownedpercentage',
            'name-input-women-black-only': 'womenblackonlypercentage',
            'name-input-disabled-any-race': 'disabledownedpercentage',
            'name-input-youth-under-35-any-race': 'youthownedpercentage'
        };


        function populate(matchCriteria) {
            for (let jsonName in matchCriteria) {
                let name = jsonToName[jsonName];
                let obj = _controlMap.get(name);
                if (obj != null) {
                    let value = matchCriteria[jsonName][0];
                    let control = obj.control;
                    control.val(value);
                }
            };
        }

        function showControls() {

            function showControl(name, div) {
                let obj = _controlMap.get(name);
                if (obj != null) {
                    let control = obj.control;
                    let val = control.val();
                    val = parseInt(val);
                    if (val > 0) {
                        $(div).show();
                    } else {
                        $(div).hide();
                    }
                }
            }
            // div: black-south-africans-only
            showControl('name-input-black-coloured-indian-pdi', '#id-div-black-only');
            showControl('name-input-women-any-race', '#id-div-women-pdi');
            showControl('name-input-women-any-race', '#id-div-women-black-only');
        }

        function dtoToForm(dto) {
            populate(dto);
            //showControls();
        }

        function formToDto(dto) {
            _controlMap.forEach(function (obj, key) {
                let jsonKey = nameToJson[key];
                dto.push({
                    name: jsonKey,
                    value: obj.control.val()
                });
            });
        }

        function reset() {
        }

        function enable(toggle) {
            let map = KTWizard2.getBusinessOwnersMap();
            map.forEach(function (val, key) {
                $("input[name=" + key).prop('disabled', toggle ^ true);
            });
        }

        function loadDto(cb) {
        }

        function submitDto(cb, ownerId) {
        }

        function init(cb) {
            cb(AddStatus());
        }

        function validate(foreward, cb) {
            let status = AddStatus();
            cb(status);
        }

        function attention(from, to, foreward, cb) {
            let companyDto = app.onboard.company.getCompanyDto(0);
            let status = AddStatus();
            if (companyDto.dto != null) {
                let propObj = JSON.parse(companyDto.dto.propertiesJson);
                if (propObj.hasOwnProperty('matchCriteriaJson') == true && propObj.matchCriteriaJson != null) {
                    let matchCriteriaJson = app.common.nvp.arrayToObject(propObj.matchCriteriaJson);
                    dtoToForm(matchCriteriaJson);
                }
                if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Add && companyDto.primaryOwner == false) {
                    enable(false);
                }
            }
            cb(AddStatus());
        }

        function neglect(from, to, foreward, cb) {
            app.onboard.company.updateMatchCriteriaJson(_controlMap, function (key) {
                let name = nameToJson[key];
                return name == null ? key : name;
            });
            cb(AddStatus());
        }

        function notify(message, data) {
            if (message == 'field-valid') {
            }
        }

        businessOwners.dtoToForm = dtoToForm;
        businessOwners.formToDto = formToDto;
        businessOwners.reset = reset;
        businessOwners.enable = enable;
        businessOwners.loadDto = loadDto;
        businessOwners.submitDto = submitDto;
        businessOwners.init = init;
        businessOwners.attention = attention;
        businessOwners.neglect = neglect;
        businessOwners.validate = validate;
        businessOwners.notify = notify;
        businessOwners.map = _controlMap;

        let _inputIdArrLiteral = [
            "id-input-total-number-of-owners",
            "id-input-how-many-are-south-africans",
            "id-input-how-many-are-not-south-africans",
            "id-input-how-many-are-companies-organisations"
        ];

        let _inputIdArrPercent = [
            "id-input-black-coloured-indian-pdi",
            "id-input-black-only",
            "id-input-women-any-race",
            //"id-input-women-pdi",
            "id-input-women-black-only",
            "id-input-disabled-any-race",
            "id-input-youth-under-35-any-race"
        ];

        for (let i = 0; i < _inputIdArrLiteral.length; i++) {
            app.common.input.numericex(_inputIdArrLiteral[i], 6, 1000000);
        }
        for (let i = 0; i < _inputIdArrPercent.length; i++) {
            app.common.input.numericex(_inputIdArrPercent[i], 3, 100);
        }
        function IsANumber(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }

    })(app.onboard.businessOwners);
//}
