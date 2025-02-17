(function () {
    $(function () {

        var _flexiEditModel = new app.ModalManager({
            viewUrl: abp.appPath + 'App/FunderSearch/FlexiEditModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/FunderSearch/_FlexiEdit.js',
            modalClass: 'FlexiEditModal'
        });

        let flexiEditAnchorId = '#id-funding-app-summary-edit-a-';

        $(flexiEditAnchorId).click(function () {
            _flexiEditModel.open();
        });  

        function actionCallback(action, output) {
            let data = {
                Id: output.data.id
            };

            if (action == 'Lock') {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/App/FunderSearch/LockApplication",
                    data: JSON.stringify(data),
                    success: function (data) {
                        location.href = '@Url.Action("Index", "FunderSearch")';
                    },
                    error: function (data) {
                    }
                });
            }

            if (action == 'Edit') {
                let data = {
                    Id: output.data.id,
                    JsonStr: output.data.json
                };

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/App/FunderSearch/Submit",
                    data: JSON.stringify(data),
                    success: function (data) {
                        location.href = '@Url.Action("Detail", "FunderSearch")';
                    },
                    error: function (data) {
                    }
                });
            }

            //if (action == 'Reload') {
            //    let view = '@Model.View';
            //    location.href = '@Url.Action("Index", "FunderSearch", new { reload = false} )';
            //}
        }

        //let smeMatchPolling = new SMEMatchPolling(actionCallback, '@Model.Reload', '@Model.View');

    });
})();