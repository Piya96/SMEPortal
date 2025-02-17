"use strict";

if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.helpers = {};

(function (helpers) {

    const TitleGuids = {
        Mr: '622605ca67e3cc13cf216096',
        Mrs: '622605ca67e3cc13cf216097',
        MS: '622605ca67e3cc13cf216098'
    };

    class Helpers {
        static isMobile() {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        static isPortrait() {
            return window.innerWidth < window.innerHeight;
        }

        static isLandscape() {
            return window.innerWidth >= window.innerHeight;
        }

        static userDtoToOwnerDto(userDto, ownerDto) {
            ownerDto.owner.identityOrPassport = userDto.identityOrPassport;
            ownerDto.owner.phoneNumber = userDto.phoneNumber;
            ownerDto.owner.name = userDto.name;
            ownerDto.owner.surname = userDto.surname;
            ownerDto.owner.emailAddress = userDto.emailAddress;
            ownerDto.owner.verificationRecordJson = userDto.verificationRecordJson;
            ownerDto.owner.isIdentityOrPassportConfirmed = userDto.isIdentityOrPassportConfirmed;
            ownerDto.owner.isPhoneNumberConfirmed = userDto.isPhoneNumberConfirmed;
        }

        static validIdentityFormat(identityNumber) {
            let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
            return regex.test(identityNumber);
        }

        static validMobileFormat(mobileNumber) {
            let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
            return regex.test(mobileNumber);
        }

        // Takes a comma delimited string (cds), splits it into an array, trims any white space from
        // start and end of each array item, removes any duplicate array items, and finally
        // it recombines the array items into a comma delimited string.
        static removeDuplicates(cds) {
            let arr = cds.split(',');
            arr.forEach((str, idx) => {
                arr[idx] = str.trim();
            });
            let map = new Map();
            arr.forEach((str, idx) => {
                if (map.has(str) == false) {
                    map.set(str, 0);
                }
            });
            let result = '';
            map.forEach((val, key) => {
                result += (key + ',');
            });
            result = result.slice(0, result.length - 1);
            return result;
        }

        static RemoveSpaces(value) {
            if (typeof value === 'string') {
                return value.toString().replace(/\s/g, '');
            } else {
                return value;
            }
        }

        static RemoveLastChar(value) {
            if (value == '') {
                return value;
            } else {
                return value.substr(0, value.length - 1);
            }
        }

        static IsANumber(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }

        static FormatNumberWithSpaces(value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }

        static show(id, toggle) {
            if (toggle == true) {
                $('#' + id).show('fast');
            } else {
                $('#' + id).hide('fast');
            }
        }

        // Given an id from an html input, attempts to return a valid signed integer value from the string.
        // In the case of no a valid number return {val:def,ret:false} defaulting the ret part to def, otherwise {val:value,ret:true}.
        static getInt(id, def = 0) {
            let val = parseInt($('#' + id).val());
            let ret = isNaN(val) == false;
            return {
                'val': ret == true ? val : def,
                'ret' : ret
            };
        }

        static formatCurrency(value) {
            let isArray = Array.isArray(value);
            value = isArray == true ? value[0] : value;

            let temp = Helpers.RemoveSpaces(value);
            if (Helpers.IsANumber(temp)) {
                temp = Helpers.FormatNumberWithSpaces(temp);
            } else {
                temp = Helpers.RemoveLastChar(temp);
            }
            return isArray == true ? [temp] : temp;
        }

        static formatCurrencyR(value) {
            return 'R' + Helpers.formatCurrency(value);
        }

        static hasNvp(arr, name) {
            for (let i = 0, max = arr.length; i < max; i++) {
                if (name == arr[i].name) {
                    return true;
                }
            }
            return false;
        }

        static setNvpValue(obj, prop, value) {
            if (obj.hasOwnProperty(prop) == false) {
                obj[prop] = [];
            }
            obj[prop].push(value);
        }

        static getNvpValue(obj, prop, idx) {
            if (Helpers.hasProp(obj, prop) == false) {
                return '';
            } else {
                // TODO: Check that prop is of type Array.
                return obj[prop][idx];
            }
        }

        static nvpDel(arr, name, value) {
            if (Array.isArray(arr) == true) {
                for (let i = 0, max = arr.length; i < max; i++) {
                    if (arr[i].name == name) {
                        arr.splice(i, 1, arr[i]);
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        static nvpAdd(arr, name, value) {
            if (Array.isArray(arr) == true) {
                for (let i = 0, max = arr.length; i < max; i++) {
                    if (arr[i].name == name) {
                        arr[i].value = value;
                        return true;
                    }
                }
                arr.push({
                    'name' : name,
                    'value' : value
                });
                return true;
            } else {
                return false;
            }
        }

        // Converts an array of {name:xxx, value:yyy} objects to an object of name:[value, ...] fields.
        // Eg: src = [{name:month,value:January},{name:fruit,value:Orange},{name:month,value:July}]
        //     dst = {month:[January,July],fruit:[Orange]}
        // Note the possibility of the src array having more than one object with the same name, hence
        // we have a dst object of xxx:[] fields.
        // That this is just the inverse of the below function, objectToNvpArray.
        static nvpArrayToObject(src) {
            let dst = {};
            src.forEach(function (obj, idx) {
                if (dst.hasOwnProperty(obj.name) == false) {
                    dst[obj.name] = [];
                }
                dst[obj.name].push(obj.value);
            });
            return dst;
        };

        // Converts an object of xxx:[] fields to an array of {name:xxx, value:yyy} objects.
        // Eg: src = {month:[January,July],fruit:[Orange]};
        //     dst = [{name:month,value:January},{name:fruit,value:Orange},{name:month,value:July}]
        // Note that this is just the inverse of the above function, nvpArrayToObject.
        static objectToNvpArray(src) {
            let dst = [];
            for (let field in src) {
                dst.push({
                    name: field,
                    value : src[field]
                });
            }
            return dst;
        };

        // Returns true if prop is a property of obj and prop is a valid JS object.
        static hasObject(obj, prop) {
            return (
                obj != null &&
                obj.hasOwnProperty(prop) == true &&
                typeof obj[prop] === 'object'
            );
        }

        static hasProp(obj, prop) {
            return obj != null && obj.hasOwnProperty(prop) == true;
        }

        static isObject(obj) {
            if ((obj instanceof Object) == true && Array.isArray(obj) == false) {
                return true;
            } else {
                return false;
            }
        }

        static setProp(obj, prop, val) {
            if (obj == null || typeof obj !== 'object') {
                return false;
            } else {
                obj[prop] = val;
                return true;
            }
        }

        static setPropEx(obj, prop, val, add = true) {
            if  (obj != null && (obj instanceof Object) == true && Array.isArray(obj) == false && (obj.hasOwnProperty(prop) == true || add == true)) {
                obj[prop] = val;
                return true;
            } else {
                return false;
            }
        }

        static getProp(obj, prop, def = NaN) {
            if (obj == null || typeof obj !== 'object') {
                return def;
            } else {
                return obj[prop];
            }
        }

        static getPropEx(obj, prop, def = NaN) {
            if (obj != null && (obj instanceof Object) == true && Array.isArray(obj) == false && obj.hasOwnProperty(prop) == true) {
                return obj[prop];
            } else {
                return def;
            }
        }

        static addClass(id, clazz, add) {
            if (add == true) {
                $('#' + id).addClass(clazz);
            } else {
                $('#' + id).removeClass(clazz);
            }
        }

        static getTitleGuidFromVerificationRecord(json) {
            if (json.Gender == 'Male') {
                return TitleGuids.Mr;
            } else {
                return json.MaritalStatus == 'Married'
                    ? TitleGuids.Mrs
                    : TitleGuids.MS;
            }
        }

        static buttonState(id1, id2) {
            return function (enable, pulse, text, __id1__ = id1, __id2__ = id2) {
                if (enable != null) {
                    $('#' + __id1__).prop('disabled', enable ^ true);
                }
                if (pulse != null) {
                    if (pulse == true) {
                        $('#' + __id1__).addClass('pulse');
                    } else {
                        $('#' + __id1__).removeClass('pulse');
                    }
                }
                if (text != null) {
                    $('#' + __id2__).text(app.localize(text));
                }
            }
        }

        static formatDate(dateStr) {
            if (dateStr == null || dateStr == '') {
                return null;
            } else {
                let date = new Date(dateStr);
                let year = date.getFullYear().toString();
                let month = (date.getMonth() + 1).toString().padStart(2, '0');
                let day = date.getDate().toString().padStart(2, '0');
                return day + '/' + month + '/' + year;
            }
        }

        static getYearsAndMonths(str) {
            if (str == '') {
                return null;
            }
            let arr = str[0].split('/');
            str = arr[1] + '/' + arr[0] + '/' + arr[2];
            let start = new Date(str);
            let end = new Date();
            let yearStart = start.getFullYear();
            let yearEnd = end.getFullYear();
            let monthStart = start.getMonth() + 1;
            let monthEnd = end.getMonth() + 1;
            let years = yearEnd - yearStart;
            let months = years == 0 ? (monthEnd - monthStart) + 1 : ((12 - monthStart) + 1) + monthEnd;


            if (years == 0) {
                return {
                    'months': months == 12 ? 0 : months,
                    'years': months == 12 ? 1 : 0
                };
            } else {
                if (months < 12) {
                    return {
                        'months': months,
                        'years': years - 1
                    };
                } else if (months >= 12) {
                    return {
                        'months': months % 12,
                        'years': years
                    };
                }
            }
        }

        static getReasonForFinanceSefa(guid) {
            let text = app.listItems.obj.getReasonForFinance(guid);
            return text == '' ? '' : text.value;
        }

        static clearTable(id) {
            function removeNode(root) {
                while (root.firstChild) {
                    removeNode(root.firstChild);
                    root.removeChild(root.firstChild);
                }
            }
            let root = document.getElementById(id);
            removeNode(root);
        }
    }

    helpers.get = function () {
        return Helpers;
    }

    class Getter {
        constructor(dto) {
            this.dto = dto;
        }

        get(field, filters = []) {
            let value = Helpers.getNvpValue(this.dto, field, 0);
            filters.forEach((fn, idx) => {
                value = fn(value);
            });
            return value;
        }

        static test() {
            let sample = {
                a: [null],
                b: [true],
                c: [''],
                d: [44],
                e: [' 55 ']
            };
            let get = app.onboard.helpers.getter(sample);

            function check(value) {
                if (value == null || value == true || value == false || isNaN(value) == true) {
                    return '';
                } else {
                    return value;
                }
            }
            let filter = [Helpers.RemoveSpaces, parseInt];
            let a = get.get('a', filter);
            let b = get.get('b', filter);
            let c = get.get('c', filter);
            let d = get.get('d', filter);
            let e = get.get('e', filter);
        }
    }

    class Setter {
        constructor(dto) {
            this.dto = dto;
        }

        set(field, filters, value) {
            filters.forEach((fn, idx) => {
                value = fn(value);
            });
            Helpers.setNvpValue(this.dto, field, value);
        }

        setProp(prop, value, filters = []) {
            filters.forEach((fn, idx) => {
                value = fn(value);
            });
            this.dto[prop] = value;
        }
    }

    class GetSet {
        constructor(dto) {
            this.dto = dto;
            this.get = new Getter(dto);
            this.set = new Setter(dto);
        }

        check(value) {
            if (value == null || isNaN(value) == true) {
                return '';
            } else {
                return value;
            }
        }

        toHtml(id, field, filters = []) {
            filters.push(this.check);
            value = this.get.get(field, filters);
            $('#' + id).val(value);
        }

        // Takes element id, name of field we wish to assign a value to in the destination
        // dto, and an array of filters ( if any ) to apply to the value retrieved from the
        // html element before updating the dto.
        fromHtml(id, field, filters = []) {
            let value = $('#' + id).val();
            this.set.set(field, [this.check].concat(filters), value);
        }
    }

    helpers.getter = function (dto) {
        return new Getter(dto);
    }

    helpers.setter = function (dto) {
        return new Setter(dto);
    }

    helpers.getset = function (dto) {
        return new GetSet(dto);
    }

    helpers.Getter = Getter;

    helpers.Setter = Setter;

    helpers.GetSet = GetSet;

})(app.onboard.helpers);
