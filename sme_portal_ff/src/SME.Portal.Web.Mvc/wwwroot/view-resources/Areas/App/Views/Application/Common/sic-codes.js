"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.common == undefined) {
    app.common = {};
}

if (app.common.sic == undefined) {
    app.common.sic = {};
}

(function (sic) {
    let helpers = null;

    let root = [];

    let section = [
    ];

    let division = [
    ];

    let group = [
    ];

    let clas = [
    ];

    let controls = {
    };

    sic.getSicData = function(section, division, group, klass, subClass) {
        //if (section == null || division == null || group == null || klass == null || subClass == null) {
          //  return null;
        //}
        let result = {
            section: {
                id : '',
                label : ''
            },
            division: {
                id: '',
                label: ''
            },
            group: {
                id: '',
                label: ''
            },
            klass: {
                id: '',
                label: ''
            },
            subClass: {
                id: '',
                label: '',
                sic : ''
            }
        };
        let curr = root;
        let i = 0;
        while (i < curr.length) {
            if (curr[i].id == section) {
                result.section.id = section;
                result.section.label = root[i].text;
                curr = curr[i].division;
                break;
            } else {
                i++;
            }
        }
        i = 0;
        while (i < curr.length) {
            if (curr[i].id == division) {
                result.division.id = division;
                result.division.label = curr[i].text;
                curr = curr[i].group;
                break;
            } else {
                i++;
            }
        }
        i = 0;
        while (i < curr.length) {
            if (curr[i].id == group) {
                result.group.id = group;
                result.group.label = curr[i].text;
                curr = curr[i].clas;
                break;
            } else {
                i++;
            }
        }
        i = 0;
        while (i < curr.length) {
            if (curr[i].id == klass) {
                result.klass.id = klass;
                result.klass.label = curr[i].text;
                curr = curr[i].subClass;
                break;
            } else {
                i++;
            }
        }
        i = 0;
        while (i < curr.length) {
            if (curr[i].id == subClass || subClass == "1234567890") {
                result.subClass.id = subClass == "1234567890" ? curr[i].id : subClass;
                result.subClass.label = curr[i].text;
                result.subClass.sic = curr[i].sic;
                curr = null;
                break;
            } else {
                i++;
            }
        }
        return result;
    }

    function generateSections() {
        let curr = '';
        industrySectors_v7.forEach((item, index) => {
            if(curr != item['SectionId']) {
                curr = item['SectionId'];
                section.push({
                    id : item['SectionId'],
                    text : item['Section'],
                    division : []
                });
            }
        });
    }
   
    function generateDivisions() {
        let curr = '';
        industrySectors_v7.forEach((item, index) => {
            if(curr != item['DivisionId']) {
                curr = item['DivisionId'];
                division.push({
                    id : item['DivisionId'],
                    text : item['Division'],
                    group : []
                });
            }
        });
    }

    function generateGroups() {
        let curr = '';
        industrySectors_v7.forEach((item, index) => {
            if(curr != item['GroupId']) {
                curr = item['GroupId'];
                group.push({
                    id : item['GroupId'],
                    text : item['Group'],
                    clas : []
                });
            }
        });
    }

    function generateClasses() {
        let curr = '';
        industrySectors_v7.forEach((item, index) => {
            if(curr != item['Subclass']) {
                curr = item['Subclass'];
                clas.push({
                    id : item['Subclass'],
                    text : item['Description'],
                    subClass : []
                });
            }
            //if (curr != item['Class']) {
            //    curr = item['Class'];
            //    if (curr == 729) {
            //        let x = 0;
            //    }
            //    clas.push({
            //        id: item['Class'],
            //        text: item['Description'],
            //        subClass: []
            //    });
            //}
        });
    }

    function generateSubclasses() {
        industrySubSectors_v7.forEach((item, index) => {
            let label = item.label;
            let sic = '';
            let i = 0;
            while(1) {
                let ch = label.charAt(i);
                if(ch == ' ' || ch == '\r' || ch == '\v' || ch == '\n' || ch == '\t') {
                    break;
                }
                i++;
                sic += ch;
            }
            i++;
            while(1) {
                let ch = label.charAt(i);
                if(ch == ' ' || ch == '\r' || ch == '\v' || ch == '\n' || ch == '\t') {
                    i++;
                } else {
                    break;
                }
            }
            item.label = item.label.slice(i, item.label.length);
            item.sic = sic;
        });
    }

    function build() {

        function find(arr, id) {
            for(let i = 0, max = arr.length;i < max; i++) {
                if(id == arr[i]['id']) {
                    return arr[i];
                }
            }
            return null;
        }

        function get(arr, id) {
            for(let i = 0, max = arr.length;i < max; i++) {
                if(id == arr[i]['id']) {
                    return arr[i];
                }
            }
            return null;
        }

        let id = null;
        industrySectors_v7.forEach((item, index) => {
            let sec = find(root, item['SectionId']);
            if(sec == null) {
                sec = get(section, item['SectionId']);
                root.push(sec);
            }

            let div = find(sec['division'], item['DivisionId']);
            if(div == null) {
                div = get(division, item['DivisionId']);
                sec['division'].push(div);
            }

            let gro = find(div['group'], item['GroupId']);
            if(gro == null) {
                gro = get(group, item['GroupId']);
                div['group'].push(gro);
            }

            //let cla = find(gro['clas'], item['Class']);
            //if (cla == null) {
            //    cla = get(clas, item['Class']);
            //    gro['clas'].push(cla);
            //}

            let cla = find(gro['clas'], item['Subclass']);
            if(cla == null) {
                cla = get(clas, item['Subclass']);
                gro['clas'].push(cla);
            }
            let i = 0;
            while(1) {
                if(i == industrySubSectors_v7.length) {
                    break;
                }
                if(cla['id'] == industrySubSectors_v7[i].sic) {
                    break;
                }
                i++;
            }
            if (i == industrySubSectors_v7.length) {
                cla['subClass'].push({
                    text: cla['text'],
                    id: '88d5754d7f8f4232a3890190efbb975b',
                    sic: cla['id']
                });
            }
            while(1) {
                if(i == industrySubSectors_v7.length) {
                    break;
                }
                if(cla['id'] != industrySubSectors_v7[i].sic) {
                    break;
                }
                cla['subClass'].push({
                    text : industrySubSectors_v7[i].label,
                    id : industrySubSectors_v7[i].key,
                    sic : industrySubSectors_v7[i].sic
                });
                i++;
            }

        });
    }

    function getPropEx(obj, prop, def = '') {
        if (obj != null && (obj instanceof Object) == true && Array.isArray(obj) == false && obj.hasOwnProperty(prop) == true) {
            return obj[prop];
        } else {
            return def;
        }
    }


    sic.refresh = function(dto) {
        let v = [];
        v.push(getPropEx(dto, 'select-sic-section'));
        v.push(getPropEx(dto, 'select-sic-division'));
        v.push(getPropEx(dto, 'select-sic-group'));
        v.push(getPropEx(dto, 'select-sic-class'));
        v.push(getPropEx(dto, 'select-sic-sub-class'));
        controls['select-sic-section'].val(v[0]);
        controls['select-sic-division'].val(v[1]);
        controls['select-sic-group'].val(v[2]);
        controls['select-sic-class'].val(v[3]);
        controls['select-sic-sub-class'].val(v[4]);
        let arr = [];
        let show = true;
        v.forEach((item, idx) => {
            arr.push(show);
            if (item == '') {
                show = false;
            }
        });
        return arr;
    }

    sic.show = function(arr) {
        function __show__(name, toggle) {
            if(toggle == true) {
                $('#' + name).show('fast');
            } else {
                $('#' + name).hide('fast');
            }
        }
        __show__('div-sic-section', arr[0]);
        __show__('div-sic-division', arr[1]);
        __show__('div-sic-group', arr[2]);
        __show__('div-sic-class', arr[3]);
        __show__('div-sic-sub-class', arr[4]);
    }

    sic.getFill = function(temp, desc = null) {
        let arr = [];
        temp.forEach((item, index) => {
            arr.push({
                value : item.id,
                text : desc == null ? item.text : '(' + desc + ' - ' + item.id + ') - ' + item.text
            });
        });
        return arr;
    }

    sic.getRoot = function () {
        return root;
    }

    sic.getRootObj = function (childId) {
        let arr = sic.getRoot();
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (1) {
            if (childId == arr[i].id) {
                return arr[i];
            }
            i++;
        }
        return '';
    }

    sic.getRootLabel = function (childId) {
        let arr = sic.getRoot();
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i].text;
            }
            i++;
        }
        return '';
    }

    sic.getDivision = function(id) {
        for(let i = 0, max = root.length; i < max; i++) {
            if(id == root[i].id) {
                return root[i].division;
            }
        }
        return null;
    }

    sic.getDivisionObj = function (parentId, childId) {
        let arr = sic.getDivision(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i];
            }
            i++;
        }
        return '';
    }

    sic.getDivisionLabel = function (parentId, childId) {
        let arr = sic.getDivision(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i].text;
            }
            i++;
        }
        return '';
    }

    sic.getGroup = function(id) {
        for(let i = 0, max = division.length; i < max; i++) {
            if(id == division[i].id) {
                return division[i].group;
            }
        }
        return null;
    }

    sic.getGroupObj = function (parentId, childId) {
        let arr = sic.getGroup(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i];
            }
            i++;
        }
        return '';
    }

    sic.getGroupLabel = function (parentId, childId) {
        let arr = sic.getGroup(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i].text;
            }
            i++;
        }
        return '';
    }

    sic.getClass = function(id) {
        for(let i = 0, max = group.length; i < max; i++) {
            if(id == group[i].id) {
                return group[i].clas;
            }
        }
        return null;
    }

    sic.getClassObj = function (parentId, childId) {
        let arr = sic.getClass(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i];
            }
            i++;
        }
        return '';
    }

    sic.getClassLabel = function (parentId, childId) {
        let arr = sic.getClass(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i].text;
            }
            i++;
        }
        return '';
    }

    sic.getSubClass = function(id) {
        for(let i = 0, max = clas.length; i < max; i++) {
            if(id == clas[i].id) {
                return clas[i].subClass;
            }
        }
        return null;
    }

    sic.getSubclassObj = function (parentId, childId) {
        let arr = sic.getSubClass(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i];
            }
            i++;
        }
        return '';
    }

    sic.getSubclassLabel = function (parentId, childId) {
        let arr = sic.getSubClass(parentId);
        if (Array.isArray(arr) == false) {
            return '';
        }
        let i = 0;
        while (i < arr.length) {
            if (childId == arr[i].id) {
                return arr[i].text;
            }
            i++;
        }
        return '';
    }

    sic.getIndustryData = function (val1, val2, val3, val4, val5) {
        let value = '';
        let v1 = sic.getRootObj(val1);
        let v2 = sic.getDivisionObj(val1, val2);
        let v3 = sic.getGroupObj(val2, val3);
        let v4 = sic.getClassObj(val3, val4);
        let v5 = sic.getSubclassObj(val4, val5);
        return {
            section : v1,
            division : v2,
            group : v3,
            class: v4,
            subClass : v5
        };
    }

    sic.fill = function(arr) {
        let fill = sic.getFill(root, 'Section');
        controls['select-sic-section'].flush();
        controls['select-sic-section'].fill(fill);

        if(arr[1] != '' || arr[0] != '') {
            let division = sic.getDivision(arr[0]);
            let fill = sic.getFill(division, 'Division');
            controls['select-sic-division'].flush();
            controls['select-sic-division'].fill(fill);
        }

        if(arr[2] != '' || arr[1] != '') {
            let group = sic.getGroup(arr[1]);
            let fill = sic.getFill(group, 'Group');
            controls['select-sic-group'].flush();
            controls['select-sic-group'].fill(fill);
        }

        if(arr[3] != '' || arr[2] != '') {
            let clas = sic.getClass(arr[2]);
            let fill = sic.getFill(clas, 'Class');
            controls['select-sic-class'].flush();
            controls['select-sic-class'].fill(fill);
        }

        if(arr[4] != '' || arr[3] != '') {
            let guid = sic.getSubClass(arr[3]);
            controls['select-sic-sub-class'].flush();
            if(guid != null) {
                let fill = sic.getFill(guid);
                controls['select-sic-sub-class'].fill(fill);
            }
        }
    }

    sic.create = function (_controls_) {
        helpers = app.onboard.helpers.get();
        controls = _controls_;
        generateSections();
        generateDivisions();
        generateGroups();
        generateClasses();
        generateSubclasses();
        build();
    }

})(app.common.sic);
