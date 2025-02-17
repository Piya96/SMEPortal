'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.fundingEssentials = {};
(function (fundingEssentials) {
    // Funder Essentials ( _StepFundingEssentials.cshtml )
    const doyouknowyourpersonalcreditscore = 'doyouknowyourpersonalcreditscore';
    const wanttouploadbusbankstatements = 'wanttouploadbusbankstatements';

    let _funderEssentials = {};
    // Funder Essentials ( _StepFundingEssentials.cshtml )
    _funderEssentials[doyouknowyourpersonalcreditscore] = { control: app.json.radio(doyouknowyourpersonalcreditscore), parentId: '' };
    _funderEssentials[wanttouploadbusbankstatements] = { control: app.json.radio(wanttouploadbusbankstatements), parentId: '' };

    function Render(matchCriteria, appId, dataArr) {

        function pushTripple(name, value, label, literal) {
            dataArr.push(
                { 'name': name, 'value': value, 'label': label, 'literal': literal }
            );
        }


        matchCriteria.forEach(function (obj, idx) {
            function setValue(json, value) {
                if (json.type == 'checkbox') {
                    json.val(value, true);
                } else {
                    json.val(value);
                }
            }
            let name = obj.name;
            if (_funderEssentials.hasOwnProperty(name) == true) {
                setValue(_funderEssentials[name].control, obj.value);
            }
        });
        let control = _funderEssentials['doyouknowyourpersonalcreditscore'].control;
        $('#id-latest-credit-score-div-' + appId).text(control.val());
        pushTripple('doyouknowyourpersonalcreditscore', control.val(), 'Do you want your latest credit score?', control.val());

        control = _funderEssentials['wanttouploadbusbankstatements'].control;
        $('#id-latest-bank-statements-div-' + appId).text(control.val());
        pushTripple('wanttouploadbusbankstatements', control.val(), 'Do you want your latest business bank statements?', control.val());
    }

    fundingEssentials.render = function (funderSearches, appId) {
        if (funderSearches != null) {
            let dataArr = [];
            Render(funderSearches, appId, dataArr);
            return dataArr;
        } else {
            return null;
        }
    };

}(app.fss.fundingEssentials));
