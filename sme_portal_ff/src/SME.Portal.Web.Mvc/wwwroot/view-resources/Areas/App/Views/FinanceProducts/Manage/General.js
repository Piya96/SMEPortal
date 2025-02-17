function checkBoxStatus(Id){
    var check = $('#' + Id).is(":checked") ? true : false;
    $('#' + Id).val(check);
}

function userShiftFocus(inputId, errorId) {
    var name = document.getElementById(inputId);
    if (!name.value.trim()) {
        name.style.borderColor = 'red'
        $(errorId).show();
    } else {
        clearInlineError(inputId, errorId);
    }
}

function clearInlineError(inputId, errorId) {
    var name = document.getElementById(inputId);
    name.style.borderColor = ''
    $(errorId).hide();
}

function populateLenderDetails(lenderId) {
    var _lendersService = abp.services.app.lenders;
    var provinceList = JSON.parse($('#ProvinceTypeLists').val());

    if (lenderId) {
        _lendersService.getLenderForEdit(lenderId).done(function (data) {
            let lenderDetails = data.lender;
            $('#PhysicalAddressLineOne').val(lenderDetails.physicalAddressLineOne);
            $('#PhysicalAddressLineTwo').val(lenderDetails.physicalAddressLineTwo);
            $('#PhysicalAddressLineThree').val(lenderDetails.physicalAddressLineThree);
            $('#City').val(lenderDetails.city);
            $('#Province').val(provinceList.filter((a) => a.ListId === lenderDetails.province).length ? provinceList.filter((a) => a.ListId === lenderDetails.province).map((p) => p.Name)[0] : "");
            $('#PostalCode').val(lenderDetails.postalCode);
            $('#LenderTypeCheck').val(lenderDetails.lenderType);
            $("#HasContract").prop('checked', lenderDetails.hasContract);
        });
    }
    else {
        $('#PhysicalAddressLineOne').val('');
        $('#PhysicalAddressLineTwo').val('');
        $('#PhysicalAddressLineThree').val('');
        $('#City').val('');
        $('#Province').val('');
        $('#PostalCode').val('');
        $('#LenderTypeCheck').val('');
        $("#HasContract").prop('checked', false);
    }
}
function createNewLenderinFinance() {

    $("#CreateNewLenderButton").click(function () {
        window.open('/App/Lenders/CreateOrEditModal', '_self');
    });
}
