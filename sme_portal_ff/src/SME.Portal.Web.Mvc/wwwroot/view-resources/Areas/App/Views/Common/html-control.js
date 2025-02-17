"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.control == undefined) {
    app.control = {};
}

(function (control) {

    function Base(name, id = null) {
        this.type = 'common';
        this.name = name;
        this.nameEq = "[name='" + name + "']";
        this.enabled = true;
        this.shown = true;
        this.userData = null;
        this.ed = id;
        this.resetFn = null;
    }

    Base.prototype.user = function (data = null) {
        if (data != null) {
            this.userData = data;
        } else {
            return this.userData
        }
    }
    Base.prototype.text = function (str = null) {
        let id = '#' + this.ed;
        if (str == null) {
            return $(id).text();
        } else {
            $(id).text(str);
        }
    }
    Base.prototype.addClass = function (name) {
        let id = '#' + this.ed;
        $(id).addClass(name);
    }
    Base.prototype.removeClass = function (name) {
        let id = '#' + this.ed;
        $(id).removeClass(name);
    }
    Base.prototype.showEx = function (toggle) {
        this.shown = toggle;
        let id = '#' + this.ed;
        if (toggle == true) {
            $(id).show();
        } else {
            $(id).hide();
        }
        //if (toggle == true) {
        //    $(this.nameEq).show();
        //} else {
        //    $(this.nameEq).hide();
        //}
    }
    Base.prototype.show = function (toggle) {
        this.shown = toggle;
        // $(this.nameEq).show/hide
        $(this.nameEq).css('visibility', toggle == true ? 'visible' : 'hidden');
    }
    Base.prototype.enable = function (toggle) {
        this.enabled = toggle;
        $(this.nameEq).prop('disabled', toggle ^ true);
    }
    Base.prototype.val = function (value = null) {
        if (value != null) {
            //value = isNaN(value) == true ? '' : value;
            $(this.nameEq).val(value);
        } else {
            return $(this.nameEq).val();
        }
    }
    Base.prototype.focus = function () {
        $(this.nameEq).focus();
    }
    Base.prototype.click = function (fn, user = null) {
        $(this.nameEq).on('click', function (arg) {
            fn(arg, user);
        });
    }
    Base.prototype.reset = function (fn = null) {
        if (fn != null) {
            this.resetFn = fn;
        } else {
            if (this.resetFn != null) {
                this.resetFn(this.ed, this.name);
            } else {
                this.val('');
            }
        }
    }

    control.base = function (name, id = null) {
        return new Base(name, id);
    }

    function Input(name, id = null) {
        Base.call(this, name, id);
        this.type = 'input';
    }
    Input.prototype = Object.create(Base.prototype);
    Input.prototype.contrustor = Input;

    Input.prototype.placeholder = function (text) {
        let id = '#' + this.ed;
        if (text == null || text == '') {
            $(id).removeAttr('placeholder')
        } else {
            $(id).attr('placeholder', text);
        }
    }
    Input.prototype.format = function (maxDigits, cb = null) {
        let id = '#' + this.ed;
        let regex = new RegExp('^[0-9]{0,' + maxDigits + '}$');
        let lastGoodValue = $(id).val();
        $('#' + this.ed).on('input', function () {
            let val = $(id).val();
            let result = regex.test(val.replace(/ /g, ""));
            if (result == false) {
                if (cb != null) {
                    val = cb(lastGoodValue);
                } else {
                    val = lastGoodValue;
                }
                $(id).val(val);
                return;
            }
            lastGoodValue = val;
            if (cb != null) {
                val = cb(lastGoodValue);
            }
            $(id).val(val);
        });

        let Reset = function () {
            lastGoodValue = '';
        }

        return {
            reset: Reset
        };
    }
    Input.prototype.formatRange = function (max, cb = null) {
        let id = '#' + this.ed;
        let regex = new RegExp('^[0-9]*$');
        let lastGoodValue = $(id).val();
        $('#' + this.ed).on('input', function () {
            let val = $(id).val().replace(/ /g, "");
            let result = regex.test(val);
            if (result == false || val > max) {
                if (cb != null) {
                    val = cb(lastGoodValue);
                } else {
                    val = lastGoodValue;
                }
                $(id).val(val);
                return;
            }
            lastGoodValue = val;
            if (cb != null) {
                val = cb(lastGoodValue);
            }
            $(id).val(val);
        });

        let Reset = function () {
            lastGoodValue = '';
        }

        return {
            reset: Reset
        };
    }


    control.input = function (name, id = null) {
        return new Input(name, id);
    }

    // User datepicker from boostrap.
    const START_DATE = '01/01/1950';
    const END_DATE = '01/01/2099';

    let today = new Date().toString();

    function _Date_(name, id) {
        Base.call(this, name, id);
        this.type = 'date';
        $('#' + id).datepicker({
            format: 'dd/mm/yyyy',
            clearBtn: false,
            autoclose: true,
            startDate: START_DATE,
            endDate: today//END_DATE
        });
    }
    _Date_.prototype = Object.create(Base.prototype);
    _Date_.prototype.contrustor = _Date_;

    //Date.prototype.placeholder = function (text) {
    //}
    _Date_.prototype.enable = function (toggle) {
        let id = '#' + this.ed;
        if (toggle == true) {
            $(id).prop('disabled', false);
            $(id).attr('readonly', false);
        } else {
            $(id).prop('disabled', true);
            $(id).attr('readonly');
        }
    }

    _Date_.prototype.set = function (date, filters = []) {
        let id = '#' + this.ed;
        filters.forEach((fn, idx) => {
            date = fn(date);
        });
        $(id).datepicker('update', date);
    }

    _Date_.prototype.get = function (filters = []) {
        let id = '#' + this.ed;
        let date = $(id).datepicker('getDate');
        filters.forEach((fn, idx) => {
            date = fn(date);
        });
        return date;
    }

    _Date_.prototype.clear = function () {
        let id = '#' + this.ed;
        $(id).datepicker('update', '');
    }

    _Date_.prototype.now = function (filters = []) {
        let today = new Date();
        this.set(today.toString(), filters);
    }

    control.date = function (name, id = null) {
        return new _Date_(name, id);
    }

    function Select(name, id = null) {
        Base.call(this, name, id);
        this.type = 'select';
    }
    Select.prototype = Object.create(Base.prototype);
    Select.prototype.contrustor = Select;
    Select.prototype.val = function (value = null) {
        if (value != null) {
            $(this.nameEq).val(value);
        } else {
            return $(this.nameEq).val();
        }
    }

    Select.prototype.placeholder = function (text) {
        let elem = document.getElementById(this.ed);
        elem[0].textContent = text;
    }

    Select.prototype.text = function () {
        return $(this.nameEq + ' option:selected').text();
    }
    Select.prototype.change = function (fn) {
        let _self = this;
        $(this.nameEq).change(function () {
            let value = Select.prototype.val.call(_self);
            let text = Select.prototype.text.call(_self);
            fn(value, text);
        });
    }
    Select.prototype.fill = function (arr, fn = null) {
        let root = document.getElementById(this.ed);
        for (let i = 0; i < arr.length; i++) {
            let elem = document.createElement('option');
            elem.value = arr[i].value;
            elem.text = arr[i].text;
            root.add(elem);
            if (fn != null) {
                fn(elem, arr[i]);
            }
        }
    }
    Select.prototype.flush = function () {
        let root = document.getElementById(this.ed);
        let max = root.children.length;
        let start = 0;
        for (let i = 0; i < max; i++) {
            let elem = root.children[start];
            if (elem.value == '') {
                start = 1;
                continue;
            }
            elem.remove();
        }
    }
    Select.prototype.sort = function (arr, asc = true) {
        let temp = [];
        for (let i = 0, max = arr.length; i < max; i++) {
            temp.push(arr[i].text + '☼' + i.toString());
        }
        temp.sort();
        if (asc == false) {
            temp.reverse();
        }
        let output = [];
        for (let i = 0, max = temp.length; i < max; i++) {
            let pair = temp[i].split('☼');
            let index = pair[1];
            output.push({ value: arr[index].value, text: arr[index].text });
        }
        temp.length = 0;
        temp = [];
        return output;
    }
    control.select = function (name, id = null) {
        return new Select(name, id);
    }

    function Select2(options) {
        this.options = options;
        if (options.hasOwnProperty('name') == false) {
            throw "options object MUST include a 'name' field from the associated <select> node";
        }
        if (options.hasOwnProperty('id') == false) {
            throw "options object MUST include a 'id' field from the associated <select> node";
        }
        if (options.hasOwnProperty('ask') == true) {
            let elem = document.createElement('option');
            elem.setAttribute('disabled', true);
            elem.setAttribute('selected', true);
            elem.setAttribute('hidden', true);
        }
        if (options.hasOwnProperty('value') == false) {
            options['value'] = 'value';
        }
        if (options.hasOwnProperty('text') == false) {
            options['text'] = 'text';
        }
        Base.call(this, options['name'], options['id']);
        this.type = 'select2';
    }

    Select2.prototype = Object.create(Base.prototype);

    Select2.prototype.contrustor = Select2;

    Select2.prototype.val = function (value = null) {
        if (value != null) {
            $(this.nameEq).val(value);
        } else {
            return $(this.nameEq).val();
        }
    }

    Select2.prototype.text = function () {
        return $(this.nameEq + ' option:selected').text();
    }

    Select2.prototype.change = function (fn, user = null) {
        let self = this;
        $(this.nameEq).change(function () {
            let index = this.selectedIndex - 1;
            let data = self.data[index];
            let value = Select2.prototype.val.call(self);
            let text = Select2.prototype.text.call(self);
            fn(value, text, data, user);
        });
    }

    function Fill(self) {
        let root = document.getElementById(self.ed);
        for (let i = 0; i < self.data.length; i++) {
            let elem = document.createElement('option');
            elem.value = self.data[i].data[self.options.value];
            elem.text = self.data[i].data[self.options.text];
            root.add(elem);
        }
    }

    Select2.prototype.fill = function (arr, flush = true) {
        if (flush == true) {
            this.flush();
        } else {
            this.data = [];
        }
        for (let i = 0; i < arr.length; i++) {
            this.data.push({
                index: i,
                data: arr[i]
            });
        }
        Fill(this);
    }

    Select2.prototype.flush = function () {
        let root = document.getElementById(this.ed);
        let start = this.options.hasOwnProperty('ask') == true ? 1 : 0;
        for (let i = start, max = root.children.length; i < max; i++) {
            let elem = root.children[start];
            elem.remove();
        }
        this.data = [];
        this.data.length = 0;
    }

    Select2.prototype.sort = function (asc = true) {
        let temp = [];
        for (let i = 0, max = this.data.length; i < max; i++) {
            temp.push(this.data[i].data[this.options.value] + '☼' + i.toString());
        }
        temp.sort();
        if (asc == false) {
            temp.reverse();
        }
        let output = [];
        for (let i = 0, max = temp.length; i < max; i++) {
            let pair = temp[i].split('☼');
            let index = parseInt(pair[1]);
            output.push({
                'index': i,
                data: this.data[index].data
            });
        }
        temp.length = 0;
        temp = [];
        this.flush();
        this.data = output;
        Fill(this);
    }

    Select2.prototype.filter = function (arr, str) {
        let result = [];
        arr.forEach(function (item, index) {
            if (item.value.includes(str) == true) {
                result.push(item);
            }
        });
        this.flush();
        this.fill(result, false);
    }

    control.select2 = function (options) {
        return new Select2(options);
    }

    function SelectMulti(name, id = null) {
        Base.call(this, name, id);
        this.type = 'selectmulti';
    }

    SelectMulti.prototype = Object.create(Base.prototype);
    SelectMulti.prototype.contrustor = Select;
    SelectMulti.prototype.val = function (value = null) {
        if (value != null) {
            let temp = this.val();
            temp.push(value);
            $(this.nameEq).val(temp);
        } else {
            return $(this.nameEq).val();
        }
    }

    SelectMulti.prototype.valEx = function (value = null) {
        if (value != null) {
            $(this.nameEq).val(value);
        } else {
            return $(this.nameEq).val();
        }
    }

    SelectMulti.prototype.fill = function (arr, fn = null) {
        let root = document.getElementById(this.ed);
        for (let i = 0; i < arr.length; i++) {
            let elem = document.createElement('option');
            elem.value = arr[i].value;
            elem.text = arr[i].text;
            root.add(elem);
            if (fn != null) {
                fn(elem, arr[i]);
            }
        }
    }
    SelectMulti.prototype.flush = function () {
        let root = document.getElementById(this.ed);
        let max = root.children.length;
        let start = 0;
        for (let i = 0; i < max; i++) {
            let elem = root.children[start];
            if (elem.value == '') {
                start = 1;
                continue;
            }
            elem.remove();
        }
    }

    control.selectmulti = function (name, id = null) {
        return new SelectMulti(name, id);
    }

    function Button(name, id = null) {
        Base.call(this, name, id);
        this.type = 'button';
    }
    Button.prototype = Object.create(Base.prototype);
    Button.prototype.contrustor = Button;
    Button.prototype.val = function (val = null) {
        if (val != null) {
            $(this.id).text(val);
        } else {
            return $(this.id).text();
        }
    }
    control.button = function (name, id = null) {
        return new Button(name, id);
    }

    function Radio(name, values) {
        Base.call(this, name);
        this._values = values;
        this._value = this.val();
        this.type = 'radio';
    }
    Radio.prototype = Object.create(Base.prototype);

    Radio.prototype.contrustor = Radio;

    Radio.prototype.click = function (fn) {
        let _self = this;
        $("input" + this.nameEq).on('click', function (arg) {
            fn(arg, _self.name, _self._value, arg.target.defaultValue);
            _self._value = arg.target.defaultValue;
        });
    }
    Radio.prototype.val = function (val = null) {
        if (val != null) {
            if (val == '' && this._value != undefined) {
                $("input" + this.nameEq + '[value="' + this._value + '"]').prop('checked', false);
                this._value = this.val();
            } else {
                //if ($.inArray(this._values, val) == -1) {
                //    //$("input" + this.nameEq + '[value="' + this._value + '"]').prop('checked', false);
                //    this._value = '';
                //} else {
                    this._value = val;
                    $("input" + this.nameEq + '[value="' + val + '"]').prop('checked', true);
                //}
            }
        } else {
            let temp = $("input" + this.nameEq + ":checked").val();
            return temp == undefined ? null : temp;
        }
    }
    control.radio = function (name, values) {
        return new Radio(name, values);
    }

    function Checkbox(name) {
        Base.call(this, name);
        this.type = 'checkbox';
        this._value = {};
        let _self = this;
        let temp = document.getElementsByName(name);
        for (let obj of temp) {
            _self._value[obj.defaultValue] = false;
        }
        //temp.forEach(function (obj, idx) {
        //    _self._value[obj.defaultValue] = false;
        //});
    }
    Checkbox.prototype = Object.create(Base.prototype);

    Checkbox.prototype.contrustor = Checkbox;

    Checkbox.prototype.click = function (fn) {
        let _self = this;
        $("input" + this.nameEq).on('click', function (arg) {
            let value = arg.target.defaultValue;
            let checked = _self.val(value);
            _self._value[value] = checked;
            fn(arg, _self.name, value, checked);
        });
    }
    Checkbox.prototype.val = function (value, checked = null) {
        if (checked != null) {
            this._value[value] = checked;
            $("input" + this.nameEq + '[value="' + value + '"]').prop('checked', checked);
        } else {
            return $("input" + this.nameEq + '[value="' + value + '"]').prop('checked');
        }
    }
    Checkbox.prototype.valAll = function (checked) {
        for (let name in this._value) {
            this._value[name] = checked;
            $("input" + this.nameEq + '[value="' + name + '"]').prop('checked', checked);
        }
    }
    Checkbox.prototype.getAll = function (checked) {
        let result = [];
        for (let name in this._value) {
            let check = $("input" + this.nameEq + '[value="' + name + '"]').prop('checked');
            if (check == checked) {
                result.push(name);
            }
        }
        return result;
    }
    control.checkbox = function (name) {
        return new Checkbox(name);
    }

})(app.control);

if (app.json == undefined) {
    app.json = {};
}

(function (json) {

    function Base(name) {
        this.type = 'common';
        this.name = name;
        this.value = null;
        this.userData = null;
    }

    Base.prototype.clear = function () {
        this.value = null;
    }

    Base.prototype.user = function (data = null) {
        if (data != null) {
            this.userData = data;
        } else {
            return this.userData
        }
    }

    Base.prototype.val = function (value = null) {
        if (value != null) {
            this.value = value;
        } else {
            return this.value;
        }
    }

    json.base = function (name) {
        return new Base(name);
    }

    function Input(name) {
        Base.call(this, name);
        this.type = 'input';
    }

    Input.prototype = Object.create(Base.prototype);
    Input.prototype.contrustor = Input;

    json.input = function (name) {
        return new Input(name);
    }

    function Select(name) {
        Base.call(this, name);
        this.type = 'select';
    }

    Select.prototype = Object.create(Base.prototype);
    Select.prototype.contrustor = Select;

    json.select = function (name) {
        return new Select(name);
    }

    function SelectMulti(name) {
        Base.call(this, name);
        this.value = [];
        this.type = 'selectmulti';
    }
    SelectMulti.prototype = Object.create(Base.prototype);
    SelectMulti.prototype.contrustor = Select;

    SelectMulti.prototype.clear = function () {
        this.value = [];
    }

    // TODO: Clear current value array???
    SelectMulti.prototype.val = function (value = null) {
        if (value != null) {
            let temp = this.val();
            temp.push(value);
        } else {
            return this.value;
        }
    }
    json.selectmulti = function (name) {
        return new SelectMulti(name);
    }

    function Radio(name) {
        Base.call(this, name);
        this.type = 'radio';
    }
    Radio.prototype = Object.create(Base.prototype);

    Radio.prototype.contrustor = Radio;

    json.radio = function (name) {
        return new Radio(name);
    }

    function Checkbox(name) {
        Base.call(this, name);
        this.type = 'checkbox';
        this.value = {};
    }
    Checkbox.prototype = Object.create(Base.prototype);

    Checkbox.prototype.contrustor = Checkbox;

    Checkbox.prototype.clear = function () {
        this.value = {};
    }

    Checkbox.prototype.val = function (value, checked = null) {
        if (checked != null) {
            this.value[value] = checked;
        } else {
            return this.value[value];
        }
    }
    Checkbox.prototype.getAll = function (checked) {
        let result = [];
        for (let name in this.value) {
            if (this.value[name] == true) {
                result.push(name);
            }
        }
        return result;
    }
    json.checkbox = function (name) {
        return new Checkbox(name);
    }

})(app.json);
