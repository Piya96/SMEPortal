//function onboardingLoadEmployees() {

    if (app.onboard == undefined) {
        app.onboard = {};
    }

    app.onboard.employees = {};

    (function (employees) {
        const numberoffulltimeemployees = 'numberoffulltimeemployees';
        const numberoffulltimewomenemployees = 'numberoffulltimewomenemployees';
        const numberoffulltimeemployeesunder35 = 'numberoffulltimeemployeesunder35';
        const numberofparttimeemployees = 'numberofparttimeemployees';
        const numberofparttimewomenemployees = 'numberofparttimewomenemployees';
        const numberofparttimeemployeesunder35 = 'numberofparttimeemployeesunder35';
        // SEFA...
        const nameinputnumberofcurrentemployees = 'name-input-number-of-current-employees';
        const nameinputnewjobsexpectedtobecreated = 'name-input-new-jobs-expected-to-be-created';

        let _controlMap = new Map();

        // Business owners
        _controlMap.set(numberoffulltimeemployees, { control: app.control.input(numberoffulltimeemployees) });
        _controlMap.set(numberoffulltimewomenemployees, { control: app.control.input(numberoffulltimewomenemployees) });
        _controlMap.set(numberoffulltimeemployeesunder35, { control: app.control.input(numberoffulltimeemployeesunder35) });
        _controlMap.set(numberofparttimeemployees, { control: app.control.input(numberofparttimeemployees) });
        _controlMap.set(numberofparttimewomenemployees, { control: app.control.input(numberofparttimewomenemployees) });
        _controlMap.set(numberofparttimeemployeesunder35, { control: app.control.input(numberofparttimeemployeesunder35) });
        // SEFA...
        _controlMap.set(nameinputnumberofcurrentemployees, { control: app.control.input(nameinputnumberofcurrentemployees) });
        _controlMap.set(nameinputnewjobsexpectedtobecreated, { control: app.control.input(nameinputnewjobsexpectedtobecreated) });

        let _controls = {};
        _controlMap.forEach(function (val, key) {
            _controls[key] = val.control;
            //if (_controls[key].type == 'input') {
            //    _controls[key].val(0);
            //}
        });

        function populate(matchCriteria) {
            for (let name in matchCriteria) {
                let obj = _controlMap.get(name);
                if (obj != null) {
                    let value = matchCriteria[name][0];
                    let control = obj.control;

                    if (control.type == 'checkbox') {
                        control.val(value, true);
                    } else {
                        control.val(value);
                    }
                }
            };
        }

        function showControls() {
        }

        function dtoToForm(dto) {
            populate(dto);
            showControls();
        }

        function formToDto(dto) {
            _controlMap.forEach(function (obj, key) {
                dto.push({
                    name: key,
                    value: obj.control.val()
                });
            });
        }

        function reset() {
        }

        function enable(toggle) {
            let map = KTWizard2.getEmployeesMap();
            map.forEach(function (val, key) {
                $("input[name=" + key).prop('disabled', toggle ^ true);
            });
        }

        function loadDto(cb) {
        }

        function submitDto(cb) {
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
            app.onboard.company.updateMatchCriteriaJson(_controlMap);
            cb(AddStatus());
        }

        function notify(message, data) {
            if (message == 'field-valid') {
            }
        }

        employees.dtoToForm = dtoToForm;
        employees.formToDto = formToDto;
        employees.reset = reset;
        employees.enable = enable;
        employees.loadDto = loadDto;
        employees.submitDto = submitDto;
        employees.init = init;
        employees.attention = attention;
        employees.neglect = neglect;
        employees.validate = validate;
        employees.notify = notify;

    })(app.onboard.employees);
//}
