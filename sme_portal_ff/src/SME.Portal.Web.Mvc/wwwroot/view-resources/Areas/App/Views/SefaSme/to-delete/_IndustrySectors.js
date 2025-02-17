if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.industrySector = {};

(function (industrySector) {

    let _selectCallback = null;

    function initSelect() {
        var sectorInfoEl;
        var categoryEl;
        var sicCode = null;
        var sectorInfo = {};

        function updateSelect(arr) {
            $('#id-div-industry-sector').show();
            $("#subsectors").prop('disabled', false);
            let options = "";

            $("#subsectors").empty();

            for (var i = 0; i < arr.length; i++) {
                let label = arr[i].label;
                let key = arr[i].key;
                options += `<option value="${key}">${label}</option>`;
            }

            $("#subsectors").append(options);
            $("#subsectors").attr("size", 5);
        }

        function selectSubSector() {
            sectorInfoEl.innerHtml = null;

            let guid = $("#subsectors").val();
            let industries = app.listItems.obj.getIndustrySector();
            let industry = industries.find(function (item, idx) {
                if (item.key == guid) {
                    return true;
                }
            });
            let o = industrySectors_v7.find(function (item, idx) {
                if (item.Subclass == industry.sicCode) {
                    return true;
                }
            });


            o['Label'] = industry.label;
            o['Guid'] = guid;
            if (_selectCallback != null) {
                _selectCallback(o);
            }
        }

        function printListObjHtml(obj) {
            return (
                "<ul>" +
                "<li>Description: " +
                obj.Description +
                "</li>" +
                "<li>Subclass: " +
                obj.Subclass +
                "</li>" +
                "<li>Group: " +
                obj.Group +
                "</li>" +
                "<li>Division:" +
                obj.Division +
                "</li>" +
                "<li>Section: " +
                obj.Section +
                "</li>" +
                "</u>"
            );
        }

        // it is a case insensitive search
        $('#industry-search').on('keyup', function search(ev) {
            if (ev.target.value.length < 3) {
                return;
            }

            var key = ev.target.value;

            let industries = app.listItems.obj.getIndustrySector();
            var searchResults = industries.filter((data) => {
                var regex = new RegExp(key, "i");
                return data.label.match(regex);
            });

            //var searchResults = industrySubSectors_v7.filter((data) => {
            //    var regex = new RegExp(key, "i");
            //    return data.label.match(regex);
            //});
            searchResults.sort(function (a, b) {
                return a.label > b.label ? 1 : -1;
            });


            updateSelect(searchResults);
        });

        sectorInfoEl = document.getElementById("sectorInfo");

        $("option[value='']")
            .attr("disabled", "disabled")
            .siblings()
            .removeAttr("disabled");

        let l = industrySectors_v7.length;

        $("#subsectors").on("change", selectSubSector);
    }

    initSelect();

    // - Provide callback function that is invoked when the user selects an item in the search result list.
    // - Returns an object with the following fields...
    // -   guid, sicCode, and description.
    // - Example...
    //     app.onboard.industrySector.setSelectCallback(function(args) {
    //         console.log(args.guid);
    //         console.log(args.sicCode);
    //         console.log(args.description);
    //     });
    industrySector.setSelectCallback = function (selectCallback) {
        _selectCallback = selectCallback;
    };

    let industrySectorInfo = false;
    $('#industry-sector-info-tooltip').on('click', (e) => {
        if (industrySectorInfo == false) {
            $('#div-industry-sector-info').show('fast');
        } else {
            $('#div-industry-sector-info').hide('fast');
        }
        industrySectorInfo ^= true;
    });

})(app.onboard.industrySector);
