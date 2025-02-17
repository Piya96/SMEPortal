"use strict"

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.isb == undefined) {
    app.wizard.isb = {};
}

(function(isb) {

    let _controls = null;

    let _names = null;

    let _divs = null;

    let root = {
        child : []
    };

    function trimIndustries() {
        industrySubSectors_v7.forEach((item, index) => {
            let i = 0;
            let sicCode = '';
            while(1) {
                let c = item.label.charAt(i);
                if(c == '\n' || c == '\r' || c == ' ' || c == '\t') {
                    break;
                } else {
                    sicCode += c;
                    i++;
                }
            }
            item.sicCode = sicCode;
            item.label = item.label.slice(i, item.label.length);
            item.label = item.label.trim();
            item.category = null;
        });
    }

    function addIndustries(node, category) {
        let i = 0;
        while(1) {
            if(industrySubSectors_v7[i].sicCode == node.id) {
                node.category = category;
                while(1) {
                    node.child.push({
                        id: industrySubSectors_v7[i].key,
                        desc: industrySubSectors_v7[i].label
                    });
                    if (++i == industrySubSectors_v7.length) {
                        break;
                    } else {
                        if (industrySubSectors_v7[i].sicCode != node.id) {
                            break;
                        }
                    }
                }
                break;
            } else {
                if (++i == industrySubSectors_v7.length) {
                    break;
                }
            }
        }
    }

    function addNode(node, category, props, count) {
        if(count < props.length) {
            let i = 0, max = node.child.length;
            while(i < max) {
                if(node.child[i].id == category[props[count]['id']]) {
                    break;
                } else {
                    i++;
                }
            }
            if(i == max) {
                node.child.push({
                    id : category[props[count]['id']],
                    desc : category.hasOwnProperty(props[count]['desc']) == true ? category[props[count]['desc']] : '',
                    child : []
                });
            }
            return addNode(node.child[i], category, props, count + 1);
        };
        if(count == props.length) {
            addIndustries(node, category);
        }
        return root;
    }

    function buildTree() {
        let props = [
            {id: 'SectionId', desc: 'Section'},
            {id: 'DivisionId', desc: 'Division'},
            {id: 'GroupId', desc: 'Group'},
            {id: 'Subclass', desc: 'Description'},
        ];
        industrySectors_v7.forEach((o, i) => {
            let node = addNode(root, o, props, 0);
        });
    }

    function __findFromId__(node, id, count, depth) {
        if(count == depth) {
            if(id == node['id']) {
                return [node];
            } else {
                return null;
            }
        }
        for(let i = 0, max = node.child.length; i < max; i++) {
            let result = __findFromId__(node.child[i], id, count + 1, depth);
            if(result != null) {
                result.push(node);
                return result;
            }
        }
        return null;
    }

    function updateControl(name, result, index) {

        function getDesc(index, id, desc) {
            switch (index) {
                case 0 :
                    return '(Section - ' + id + ') - ' + desc;

                case 1:
                    return '(Division - ' + id + ') - ' + desc;

                case 2:
                    return '(Group - ' + id + ') - ' + desc;

                case 3:
                    return '(Class - ' + id + ') - ' + desc;

                case 4:
                    return desc;
            }
        }

        _controls[name].flush();
        let arr = [];            
        result[index].child.forEach((item, idx) => {
            arr.push({
                value : item.id,
                text: getDesc(index, item.id, item.desc)
            });
        });
        _controls[name].fill(arr);
        _controls[name].val(result[index + 1].id);
        $('#' + _divs[index]).show();
    }

    function changeReset(result, name, index, nameArr, divArr) {

        function getDesc(index, id, desc) {
            switch (index) {
                case 0:
                    return '(Section - ' + id + ') - ' + desc;

                case 1:
                    return '(Division - ' + id + ') - ' + desc;

                case 2:
                    return '(Group - ' + id + ') - ' + desc;

                case 3:
                    return '(Class - ' + id + ') - ' + desc;

                case 4:
                    return desc;
            }
        }

        let arr = [];
        result[index].child.forEach((item, idx) => {
            arr.push({
                value : item.id,
                text: getDesc(index, item.id, item.desc)
            });
        });
        _controls[name].flush();
        _controls[name].fill(arr);
        _controls[name].val('');
        $('#' + _divs[index]).show('fast');
        nameArr.forEach((name, i) => {
            $('#' + divArr[i]).hide('fast');
            _controls[name].flush();
        });
    }

    isb.findFromId = function(id, depth) {
        let result = __findFromId__(root, id, 0, depth);
        return result != null ? result.reverse() : null;
    }

    isb.refresh = function(id) {
        let result = isb.findFromId(id, 5);
        if (result != null) {
            updateControl(_names[0], result, 0);
            updateControl(_names[1], result, 1);
            updateControl(_names[2], result, 2);
            updateControl(_names[3], result, 3);
            updateControl(_names[4], result, 4);
            return true;
        } else {
            return false;
        }
    }

    isb.reset = function () {
        changeReset([root], _names[0], 0, [_names[1], _names[2], _names[3], _names[4]], [_divs[1], _divs[2], _divs[3], _divs[4]]);
    }

    isb.addCallbacks = function(hooks = null) {
        _controls[_names[0]].change((value, text) => {
            let result = isb.findFromId(value, 1);
            if (hooks != null) {
                hooks[0](0, result);
            }
            changeReset(result, _names[1], 1, [_names[2], _names[3], _names[4]], [_divs[2], _divs[3], _divs[4]]);
        });

        _controls[_names[1]].change((value, text) => {
            let result = isb.findFromId(value, 2);
            if (hooks != null) {
                hooks[1](1, result);
            }
            changeReset(result, _names[2], 2, [_names[3], _names[4]], [_divs[3], _divs[4]]);
        });

        _controls[_names[2]].change((value, text) => {
            let result = isb.findFromId(value, 3);
            if (hooks != null) {
                hooks[2](2, result);
            }
            changeReset(result, _names[3], 3, [_names[4]], [_divs[4]]);
        });

        _controls[_names[3]].change((value, text) => {
            let result = isb.findFromId(value, 4);
            if (hooks != null) {
                hooks[3](3, result);
            }
            changeReset(result, _names[4], 4, [], []);
        });

        _controls[_names[4]].change((value, text) => {
            let result = isb.findFromId(value, 5);
            if (hooks != null) {
                hooks[4](4, result);
            }
            let guid = value;
        });
    }

    isb.init = function(controls, names, divs) {
        _controls = controls;
        _names = names;
        _divs = divs;
        trimIndustries();
        buildTree();
    };



})(app.wizard.isb);
