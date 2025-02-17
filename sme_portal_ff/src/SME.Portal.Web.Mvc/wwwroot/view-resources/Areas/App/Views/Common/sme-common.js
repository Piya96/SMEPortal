'use strict';

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

(function (wizard) {

    wizard.Result = {
        Success: 0,
        Fail: 1,
        Warning: 2,
        WarningUpdated: 3,
        Cancel: 4
    };
    
    wizard.addResult = function () {
        return {
            status: wizard.Result.Success,
            exception: false,
            code: 0,
            message: '',
            data: null
        }
    };

})(app.wizard);

// TODO: Make sure this is not duplicated somewhere else!!!
let Result = {
    Pass: 0,
    Warning: 1,
    WarningUpdated: 2,
    Fail: 3,
    Cancel: 4
};

function AddStatus() {
    return {
        result: Result.Pass,
        exception: false,
        code: 0,
        message: 'ok'
    };
}

if (app.common == undefined) {
    app.common = {};
}

app.common.nvp = {};

(function (nvp) {
    // Description...
    //   Translates an array of (name, value) pair objects to an object of (name, [value1, ..., valueN]) pairs.
    // Example...
    //   [{'name':'firstName', 'value':'Peter'}, {'name':'lastName', 'value':'Lewis'}] translates to
    //   {'firstName':['Peter'], 'lastName':['Lewis']}
    // Notes...
    //   Reason we translate to name:[] pairs is the case of more than one 'name' existing, for example
    //   [{'name':'firstName', 'value':'Peter'}, {'name':'firstName', 'value':'Eugene'}] cannot exist as
    //   {'firstName':'Peter', 'firstName':'Lewis'} since this is not possible in json so the translated
    //   object looks like {'firstName':['Peter', 'Lewis'] }
    nvp.arrayToObject = function(src) {
        let dst = {};
        src.forEach(function (obj, idx) {
            if (dst.hasOwnProperty(obj.name) == false) {
                dst[obj.name] = [];
            }
            dst[obj.name].push(obj.value);
        });
        return dst;
    };
    // Description...
    //   Translates an an object of (name, [value1, ..., valueN]) pairs to an array of (name, value) pair objects.
    // Example...
    //   src = { 'firstName':['Peter'], 'lastName':['Lewis'] } translated to
    //   dst = [{ 'name': 'firstName', 'value': 'Peter' }, { 'name': 'lastName', 'value': 'Lewis' }].
    // Notes...
    //   In the event of name:[] pairs from the src with [].length > 1 we will just have duplicate names
    //   wrapped up in objects which is allowed in json, for example src = {'firstName':['Peter', 'Lewis'] }
    //   translates to dst = [{'name':'firstName', 'value':'Peter'}, {'name':'firstName', 'value':'Eugene'}].
    nvp.objectToArray = function (src) {
        let dst = [];
        for (const name in src) {
            let value = src[name];
            value.forEach(function (val, idx) {
                dst.push({
                    'name': name,
                    'value': val
                });
            });
        }
        return dst;
    };
})(app.common.nvp);

app.common.gmap = {};

(function (gmap) {
    let _provinceCodes = [
        {
            key: 'EC', value: 'Eastern Cape', tenant : 'ECDC', ranges: [
                { lo: 4730, hi: 4730 },
                { lo: 4731, hi: 4731 },
                { lo: 4735, hi: 4735 },
                { lo: 4736, hi: 4736 },
                { lo: 4737, hi: 4737 },
                { lo: 4738, hi: 4738 },
                { lo: 4740, hi: 4740 },
                { lo: 4742, hi: 4742 },
                { lo: 4743, hi: 4743 },
                { lo: 4744, hi: 4744 },
                { lo: 4788, hi: 4788 }
            ]
        },
        {
            // Special priority Eastern Cape codes.
            key: 'EC', value: 'Eastern Cape', tenant: '', ranges: [
                { lo: 4770, hi: 4770 },
                { lo: 4772, hi: 4772 },
                { lo: 4773, hi: 4773 },
                { lo: 4774, hi: 4774 },
                { lo: 4776, hi: 4776 },
                { lo: 5437, hi: 5437 },
                { lo: 5470, hi: 5470 },
                { lo: 5471, hi: 5471 },
                { lo: 5480, hi: 5480 },
                { lo: 5481, hi: 5481 },
                { lo: 5482, hi: 5482 },
                { lo: 9742, hi: 9742 },
                { lo: 9744, hi: 9744 },
                { lo: 9750, hi: 9750 },
                { lo: 9755, hi: 9755 },
                { lo: 9756, hi: 9756 },
                { lo: 9760, hi: 9760 },
                { lo: 9762, hi: 9762 },
                { lo: 9786, hi: 9786 },
                { lo: 9787, hi: 9787 },
                { lo: 9798, hi: 9798 }
            ]
        },
        {
            // 1 299, 1400 1699, 1700 1799, 1800 1999, 2000 2199, { 'GT', 'Gauteng' }
            key: 'GT', value: 'Gauteng', tenant: '', ranges: [
                { lo: 1, hi: 299 },
                { lo: 1400, hi: 1699 },
                { lo: 1700, hi: 1799 },
                { lo: 1800, hi: 1999 },
                { lo: 2000, hi: 2199 }
            ]
        },
        {
            // 0300 0499, 2500 2899, { 'NW', 'North West' }
            key: 'NW', value: 'North West', tenant: '', ranges: [
                { lo: 300, hi: 499 },
                { lo: 2500, hi: 2899 }
            ]
        },
        {
            // 0500 0698, 0699 0999, { 'LP', 'Limpopo' }
            key: 'LP', value: 'Limpopo', tenant: '', ranges: [
                { lo: 500, hi: 698 },
                { lo: 699, hi: 999 }
            ]
        },
        {
            // 1000 1399, 2200 2499, { 'MP', 'Mpumalanga' }
            key: 'MP', value: 'Mpumalanga', tenant: '', ranges: [
                { lo: 1000, hi: 1399 },
                { lo: 2200, hi: 2499 }
            ]
        },
        {
            // 2900 3199, 3200 3299, 3300 3599, 3600 3799, 3800 3999, 4000 4099, 4100 4299, 4300 4499, 4500 4730, { 'KZ', 'KwaZulu-Natal' }
            key: 'KZ', value: 'KwaZulu-Natal', tenant: '', ranges: [
                { lo: 2900, hi: 3199 },
                { lo: 3200, hi: 3299 },
                { lo: 3300, hi: 3599 },
                { lo: 3600, hi: 3799 },
                { lo: 3800, hi: 3999 },
                { lo: 4000, hi: 4099 },
                { lo: 4100, hi: 4299 },
                { lo: 4300, hi: 4499 },
                { lo: 4500, hi: 4730 }
            ]
        },
        {
            // 4731 5199, 5200 5299, 5300 5499, 5500 5999, 6000 6099, 6100 6499, { 'EC', 'Eastern Cape' }
            key: 'EC', value: 'Eastern Cape', tenant: '', ranges: [
                { lo: 4731, hi: 5199 },
                { lo: 5200, hi: 5299 },
                { lo: 5300, hi: 5499 },
                { lo: 5500, hi: 5999 },
                { lo: 6000, hi: 6099 },
                { lo: 6100, hi: 6499 },
                { lo: 9786, hi: 9786 }
            ]
        },
        {
            // 6500 6699, 6700 6899, 6900 7099, 7100 7299, 7300 7399, 7400 7599, 7600 7699, 7700 8099, { 'WC', 'Western Cape' }
            key: 'WC', value: 'Western Cape', tenant: '', ranges: [
                { lo: 6500, hi: 6699 },
                { lo: 6700, hi: 6899 },
                { lo: 6900, hi: 7099 },
                { lo: 7100, hi: 7299 },
                { lo: 7300, hi: 7399 },
                { lo: 7400, hi: 7599 },
                { lo: 7600, hi: 7699 },
                { lo: 7700, hi: 8099 }
            ]
        },
        {
            // 8100 8299, 8300 8799, 8800 8999, { 'NC', 'Northern Cape' }
            key: 'NC', value: 'Northern Cape', tenant: '', ranges: [
                { lo: 8100, hi: 8299 },
                { lo: 8300, hi: 8799 },
                { lo: 8800, hi: 8999 }
            ]
        },
        {
            // 9300 9399, 9400 9699, 9700 9899, 9900 9999, { 'FS', 'Free State' }
            key: 'FS', value: 'Free State', tenant: '', ranges: [
                { lo: 9300, hi: 9399 },
                { lo: 9400, hi: 9699 },
                { lo: 9700, hi: 9785 },
                { lo: 9787, hi: 9899 },
                { lo: 9900, hi: 9999 }
            ]
        }
    ];

    // Description...
    //   - Takes areaCode ( string ) and returns the associated province (code, name) pair based on where
    //     is is in the ranges above.
    function AreaCodeToProvince(areaCode, tenant = '') {
        if (areaCode == null || areaCode == '') {
            return null;
        }
        let result = isNaN(areaCode);
        if (result == true) {
            return null;
        } else {
            let code = parseInt(areaCode);
            for (let i = 0, max1 = _provinceCodes.length; i < max1; i++) {

                let province = _provinceCodes[i];
                //if (province.tenant != '') {
                //    if (province.tenant != tenant) {
                //        continue;
                //    }
                //}
                for (let j = 0, max2 = province.ranges.length; j < max2; j++) {

                    let range = province.ranges[j];
                    if (code >= range.lo && code <= range.hi) {
                        return {
                            key: province.key,
                            value: province.value,
                            tenant: province.tenant
                        }
                    }
                }
            }
            return null;
        }
    }

    function ValidProvinceCode(code) {
        return (
            code == 'GT' ||
            code == 'NW' ||
            code == 'LP' ||
            code == 'MP' ||
            code == 'KZ' ||
            code == 'EC' ||
            code == 'WC' ||
            code == 'NC' ||
            code == 'FS'
        );
    }

    gmap.areaCodeToProvince = AreaCodeToProvince;

    gmap.validProvinceCode = ValidProvinceCode;

})(app.common.gmap);

if (app.common.input == undefined) {
    app.common.input = {};
}

(function (input) {

    function Numeric(inputId, maxDigits) {
        let regex = new RegExp('^[0-9]{0,' + maxDigits + '}$');
        let lastGoodValue = $('#' + inputId).val();
        $('#' + inputId).on('input', function () {
            let val = $('#' + inputId).val();
            let result = regex.test(val);
            if (result == false) {
                $('#' + inputId).val(lastGoodValue);
                return;
            }
            lastGoodValue = val;
        });

        let Reset = function () {
            lastGoodValue = '';
        }

        return {
            reset : Reset
        };
    }

    function NumericEx(inputId, maxDigits, maxValue) {
        let regex = new RegExp('^[0-9]{0,' + maxDigits + '}$');
        let lastGoodValue = $('#' + inputId).val();
        $('#' + inputId).on('input', function () {
            let val = $('#' + inputId).val();
            let result = regex.test(val);
            if (result == false) {
                $('#' + inputId).val(lastGoodValue);
                return;
            }
            let num = parseInt(val);
            if (num > maxValue) {
                $('#' + inputId).val(lastGoodValue);
                return;
            }
            lastGoodValue = val;
        });

        let Reset = function () {
            lastGoodValue = '';
        }

        return {
            reset: Reset
        };
    }

    input.numeric = Numeric;
    input.numericex = NumericEx;
})(app.common.input);

let smec = function () {
    let init = function () {

    };

    let modal = function (
        modalId,
        saveId,
        actionCallback = null
    ) {
        let self = this;

        this.modalId = modalId;
        this.actionCallback = actionCallback;
        this.saveId = saveId;

        $('#' + modalId).modal({
            backdrop: 'static',
            keyboard: true,
            show: false
        });

        function onSave(actionCallback) {
            if (actionCallback != null) {
                actionCallback('Save', function (status) {
                    if (status == true) {
                        $('#' + modalId).modal('hide');
                    }
                });
            }
        }

        this.show = function (actionCallback = null) {
            // TODO: Sort this hard coded crap out!
            $('#id-modal-save').click(onSave.bind(this, actionCallback));
            //document.getElementById(saveId).addEventListener('click', onSave.bind(this, actionCallback), false);
            if (actionCallback != null) {
                this.actionCallback = actionCallback;
                actionCallback('Show', null);
            }
            $('#' + modalId).modal('show');
        };

        this.hide = function () {
            $('#' + modalId).modal('hide');
        };

        $('#' + modalId).on('hidden.bs.modal', function () {
            if (actionCallback != null) {
                actionCallback('Hide');
            }
        });
    };

    let spinner = function (
        modalId,
        animId,
        headerId = null
    ) {
        let self = this;

        this.modalId = modalId;
        this.animId = animId;
        this.headerId = headerId;

        this.show = function (text = null) {
            if (text != null) {
                $('#' + self.headerId).text(text);
            }
            document.getElementById(self.animId).style.visibility = "visible";
            $('#' + modalId).modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        };

        this.hide = function () {
            document.getElementById(self.animId).style.visibility = "hidden";
            $('#' + modalId).modal('hide');
        };
    };

    // Converts a string of 8-bit characters to binary blob and saves to given file name in downloads folder.
    let downloadBinary = function (
        byteChars,
        fileName
    ) {
        let byteNumbers = new Array(byteChars.length);
        for (let i = 0, max = byteChars.length; i < max; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let blob = new Blob([byteArray], { type: 'application/octet-stream' });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        window.URL.revokeObjectURL(url);
        anchor.remove();
        return byteArray;
    };

    // Returns DOB date (dd/mm/yy) from identity number.
    let dobFromId = function (id) {
        let day = id.slice(4, 6);
        let month = id.slice(2, 4);
        let year = id.slice(0, 2);
        return (day + '/' + month + '/' + year);
    };

    let provinceMap = null;

    (function createProvinceMap() {
        function mapData(key, text) {
            return {
                key: key,
                value: {
                    text : text
                }
            };
        }
        let data = [];
        data.push(mapData('FS', 'Free State'));
        data.push(mapData('LP', 'Limpopo'));
        data.push(mapData('WC', 'Western Cape'));
        data.push(mapData('GT', 'Gauteng'));
        data.push(mapData('EC', 'Eastern Cape'));
        data.push(mapData('MP', 'Mpumalanga'));
        data.push(mapData('KZ', 'KwaZulu-Natal'));
        data.push(mapData('NW', 'North West'));
        data.push(mapData('NC', 'Northern Cape'));

        let arr = [];
        arr.push('Free State☼0');
        arr.push('Limpopo☼1');
        arr.push('Western Cape☼2');
        arr.push('Gauteng☼3');
        arr.push('Eastern Cape☼4');
        arr.push('Mpumalanga☼5');
        arr.push('KwaZulu-Natal☼6');
        arr.push('North West☼7');
        arr.push('Northern Cape☼8');

        arr.sort();

        provinceMap = new Map();
        for (let i = 0, max = arr.length; i < max; i++) {
            let temp = arr[i].split('☼');
            let index = parseInt(temp[1]);
            provinceMap.set(data[index].key, data[index].value);
        }
    })();

    // TODO: Not sure if this data should reside here!!!
    let companyTypeMap = null;
    (function createCompanyTypeMap() {
        let arr1 = [];
        let arr2 = [];
        function pushData(key, mask, placeholder, text, cpbAlias, count, type) {
            arr1.push({ 'key': key, 'mask': mask, 'placeholder': placeholder, 'cpbAlias': cpbAlias, 'type' : type });
            arr2.push(text + '☼' + count.toString());
        }
        pushData('5a6ab7cd506ea818e04548ac', '9999/999999/\\0\\7', 'YYYY/000000/07', '(Pty) Ltd', 'Private Company', 0, '07');
        pushData('5a6ab7ce506ea818e04548ad', '', 'No registration number required', 'Sole Proprietor', 'Sole Proprietor', 1, '');
        pushData('5a6ab7d0506ea818e04548ae', '9999/999999/\\2\\3', 'YYYY/000000/23', 'Close Corporation', 'Close Corporation', 2, '23');
        pushData('5a6ab7d2506ea818e04548af', '9999/999999/\\2\\4', 'YYYY/000000/24', 'Primary Co-operative', '.', 3, '24');
        pushData('5a6ab7d3506ea818e04548b0', '', 'Enter registration number', 'Partnership', 'Partnership', 4, '.', '');
        pushData('5a6ab7d8506ea818e04548b1', '9999/999999/\\0\\6', 'YYYY/000000/06', 'Public Company', 'Public Company', 5, '06');
        pushData('5a6ab7ea506ea818e04548b2', '\\I\\T/999/9999/999', 'IT/000/YYYY/XXX', 'Trust', 'Trust', 6, '');
        pushData('5a6ab809506ea818e04548b3', '9999/999999/\\0\\8', 'YYYY/000000/08', 'Not for Profit Organisation (NPO)', '.', 7, '08');
        pushData('5a6ab80c506ea818e04548b5', '9999/999999/\\0\\8', 'YYYY/000000/08', 'Section 21', '.', 8, '08');
        pushData('5a6ab813506ea818e04548b6', '', 'Enter registration number', 'Government Entities', 'Government Entities', 9, '');
        pushData('5a6ab817506ea818e04548b7', '9999/999999/\\0\\8', 'YYYY/000000/08', 'Public Benefit Organisation', '.', 10, '08');
        pushData('5c3cdd53261c1e011c7b67c4', '9999/999999/\\1\\0', 'YYYY/000000/10', 'Internationally Registered Company', '.', 11, '10');//???
        pushData('5c3cdd79261c1e011c7b67c5', '9999/999999/\\1\\1', 'YYYY/000000/11', 'Internationally Registered Not for Profit Company', '.', 12, '11');
        pushData('5c3cdda7261c1e011c7b67c6', '9999/999999/\\0\\8', 'YYYY/000000/08', 'Non Profit Company (NPC)', 'Non Profit Company', 13, '08');
        pushData('5c3cde39261c1e011c7b67c7', '', 'Enter registration number', 'Personal Liability Company', '.', 14, '');
        pushData('5c3cdecd261c1e011c7b67c8', '9999/999999/\\2\\5', 'YYYY/000000/25', 'Secondary Co-operative', '.', 15, '25');
        pushData('5c3cdf0a261c1e011c7b67c9', '9999/999999/\\2\\6', 'YYYY/000000/26', 'Tertiary Co-operative', '.', 16, '26');
        pushData('5a6ab80b506ea818e04548b4', '9999/999999/\\0\\8', 'YYYY/000000/08', 'Non-Government Organisation (NGO)', '.', 17, '08');

        pushData('63ef3f84db16393316a1ee05', '9999/999999/\\0\\9', 'YYYY/000000/\\0\\9', 'Limited by Guarentee', 'Limited by Guarentee', 18, '09');
        pushData('63ef3f9cce7c33519edd4236', '9999/999999/\\1\\2', 'YYYY/000000/\\1\\2', 'External company under Section 21A', 'External company under Section 21A', 19, '12');//???
        pushData('63ef3fb3c75e9141b36e268e', '9999/999999/\\2\\1', 'YYYY/000000/\\2\\1', 'Inc', 'Inc', 20, '21');
        pushData('63ef3fca4de7b7ab187f5983', '9999/999999/\\2\\2', 'YYYY/000000/\\2\\2', 'Unlimited', 'Unlimited', 21, '22');
        pushData('63ef3fe2677df4624d35deb7', '9999/999999/\\3\\0', 'YYYY/000000/\\3\\0', 'State owned Company (SOC Ltd)', 'State owned Company (SOC Ltd)', 22, '30');
        pushData('63ef3ffa4a17eb76e00d0b2e', '9999/999999/\\3\\1', 'YYYY/000000/\\3\\1', 'Statutory Body', 'Statutory Body', 23, '31');

        arr2.sort();

        companyTypeMap = new Map();
        for (let i = 0, max = arr2.length; i < max; i++) {
            let arr3 = arr2[i].split('☼');
            let index = parseInt(arr3[1]);
            companyTypeMap.set(
                arr1[index].key,
                {
                    'text': arr3[0],
                    'mask': arr1[index].mask,
                    'placeholder': arr1[index].placeholder,
                    'cpbAlias': arr1[index].cpbAlias,
                    'type': arr1[index].type
                }
            );
        }
    })();

    let getNameFromCpbAlias = function (alias) {
        for (let [key, value] of companyTypeMap.entries()) {
            if (value.cpbAlias === alias) {
                return value.text;
            }
        }
        return null;
    }

    let companyTypeFromKey = function (key) {
        let value = companyTypeMap.get(key);
        return value;
    };

    let keyFromCompanyType = function (type) {
        for (let [key, value] of companyTypeMap.entries()) {
            if (value.text === type) {
                return key;
            }
        }
        return null;
    }

    let getCompanyTypeObj = function (typeCode) {
        for (let [key, value] of companyTypeMap.entries()) {
            if (value.type === typeCode) {
                return value;
            }
        }
        return null;
    }

    let keyFromCompanyAlias = function (alias, companyTypeCode) {
        for (let [key, value] of companyTypeMap.entries()) {
            if (value.cpbAlias === alias) {
                return key;
            }
        }
        for (let [key, value] of companyTypeMap.entries()) {
            if (value.type === companyTypeCode) {
                return key;
            }
        }
        return null;
    }

    let fillSelectArr = function (id, arr) {
        let root = document.getElementById(id);
        for (let i = 0; i < arr.length; i++) {
            let elem = document.createElement('option');
            elem.text = arr[i];
            root.add(elem);
        }
    };

    let fillSelectArrEx = function (id, arr) {
        let root = document.getElementById(id);
        for (let i = 0; i < arr.length; i++) {
            let elem = document.createElement('option');
            elem.value = arr[i].key;
            elem.text = arr[i].text;
            root.add(elem);
        }
    };

    // TODO: Take a creaful look at this!
    let fillSelect = function (selectId, map) {
        let root = document.getElementById(selectId);
        map.forEach(function (value, key) {
            let elem = document.createElement('option');
            elem.text = value.text;
            elem.value = key;
            root.add(elem);
        });
    };

    let flushSelect = function (selectId) {
        let root = document.getElementById(selectId);
        let max = root.children.length;
        for (let i = 1; i < max; i++) {
            let elem = root.children[1];
            elem.remove();
        }
    };

    let fillSel = function (selectId, arr, name) {
        let root = document.getElementById(selectId);
        for (let i = 0; i < arr.length; i++) {
            let optionElem = document.createElement('option');
            optionElem.text = arr[i][name];
            optionElem.value = i.toString();
            root.add(optionElem);
        }
    };

    let toggleAnchor = function (id, enable) {
        let elem = document.getElementById(id);
        if (elem != null) {
            elem.style['pointer-events'] = enable == false ? 'none' : 'initial';
        }
    };

    let MobileIdMismatch = function (cb) {
        Swal.fire({
            html: 'Mobile Number could not be matched against numbers listed for this Identity Number<br/><br/>Please capture another Identity Number or Mobile Number and verify again',
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            cb(AddStatus());
        });
    }

    return {
        init: init,
        spinner: spinner,
        modal : modal,
        downloadBinary: downloadBinary,
        dobFromId: dobFromId,
        companyTypeFromKey: companyTypeFromKey,
        fillSelect: fillSelect,
        fillSelectArr: fillSelectArr,
        fillSelectArrEx: fillSelectArrEx,
        flushSelect : flushSelect,
        companyTypeMap: companyTypeMap,
        provinceMap: provinceMap,
        toggleAnchor: toggleAnchor,
        keyFromCompanyType: keyFromCompanyType,
        keyFromCompanyAlias: keyFromCompanyAlias,
        getNameFromCpbAlias: getNameFromCpbAlias,
        getCompanyTypeObj: getCompanyTypeObj,
        fillSel: fillSel,
        mobileIdMismatch: MobileIdMismatch
    }
}();
