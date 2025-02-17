var lender;
var select = document.getElementById("Lender_Country").value;
var province = document.getElementById("province")
var hProvince = document.getElementById("hProvince")
if (select == "ZA") {
    province.style.display = "block"
    hProvince.style.display = "block"
} else {
    province.style.display = "none"
    hProvince.style.display = "none"
}
var _lendersService = abp.services.app.lenders;
function saveLenderForm() {
    if (!$('#LenderInformationsForm').valid()) {
        return;
    }
    lender = $('#LenderInformationsForm').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    if (lender) {
        _lendersService.createOrEdit(
            lender
        ).done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            window.location.assign('/App/Lenders');
        });
    }
}