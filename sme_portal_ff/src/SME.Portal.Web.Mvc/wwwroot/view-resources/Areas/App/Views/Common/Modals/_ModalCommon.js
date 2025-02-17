if (app.modal == undefined) {
    app.modal = {};
}

app.modal.common = null;

(function (modal) {

    function renderPartialView(view, cb) {
        let data = {
            view: view
        };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/SME/RenderPartialView",
            data: JSON.stringify(data),
            //dataType : 'json',
            success: function (data) {
                let body = $('body');
                let html = $.parseHTML(data);
                let elem = body.append(html);
                cb();
            },
            error: function (data) {
            }
        });
    }

    modal.common = {
        renderPartialView: renderPartialView
    };

})(app.modal);
