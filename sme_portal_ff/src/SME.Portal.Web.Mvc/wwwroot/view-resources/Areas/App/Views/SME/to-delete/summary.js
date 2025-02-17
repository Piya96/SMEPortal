'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.summary = null;

(function (onboard) {

    function renderCompanySummaries(cb) {
    
        app.fss.controller.renderOnboarding(
            app.onboard.user.dto,
            app.onboard.owner.dto,
            app.onboard.company.getDto(0),
            "0"
        )
    
        cb(AddStatus());
    }
    
    function loadDto(cb) {
        cb(AddStatus());
    }
    
    function validate(foreward, cb) {
        cb(AddStatus());
    }
    
    function attention(from, to, foreward, cb) {
        if (foreward == true) {
    
            let businessOwners = [];
            app.onboard.businessOwners.formToDto(businessOwners);
            let employees = [];
            app.onboard.employees.formToDto(employees);
            let matchCriteriaJson = [];
            matchCriteriaJson = businessOwners.concat(employees);
            //app.onboard.company.updateMatchCriteriaJson(matchCriteriaJson);
            renderCompanySummaries(function (status) {
                cb(status);
            });
        }
    }

    function neglect(from, to, foreward, cb) {
        cb(AddStatus());
    }
    
    onboard.summary = {
        loadDto: loadDto,
        attention: attention,
        neglect: neglect,
        validate: validate
    };

})(app.onboard);
