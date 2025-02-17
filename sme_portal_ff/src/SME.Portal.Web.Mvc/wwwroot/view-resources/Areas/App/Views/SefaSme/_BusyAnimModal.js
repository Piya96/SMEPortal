if (app.modal == undefined) {
    app.modal = {};
}

app.modal.busy = null;

(function (modal) {

    const _idModalWaiting = 'id-modal-waiting-';

    const _idModalWaitingHeader = 'id-modal-waiting-header-';

    const _idModalWaitingAnim = 'id-modal-waiting-anim-';

    let _uniqueId = 1;

    function Modal() {
        let _idModalWaitingCurr = _idModalWaiting + _uniqueId;
        let _idModalWaitingHeaderCurr = _idModalWaitingHeader + _uniqueId;
        let _idModalWaitingAnimCurr = _idModalWaitingAnim + _uniqueId;

        //let _modalCallback = null;

        let _shownCallback = null;
        let _hiddenCallback = null;

        function init() {
            //_modalCallback = cb;
        }

        function show(htmlView, text, cb) {

            function initModal() {
                $('#' + _idModalWaiting).attr('id', _idModalWaitingCurr);
                $('#' + _idModalWaitingHeader).attr('id', _idModalWaitingHeaderCurr);
                $('#' + _idModalWaitingAnim).attr('id', _idModalWaitingAnimCurr);

                _uniqueId++;

                window.setTimeout(function () {
                    $('#' + _idModalWaitingCurr).keydown(function (args) {
                    });

                    $('#' + _idModalWaitingCurr).on('shown.bs.modal', function () {
                        if (_shownCallback) {
                            _shownCallback();
                            _shownCallback = null;
                        }
                    });

                    $('#' + _idModalWaitingCurr).on('hidden.bs.modal', function () {
                        if (_hiddenCallback != null) {
                            _hiddenCallback();
                            _hiddenCallback = null;
                        }
                        $('#' + _idModalWaitingCurr).remove();
                    });

                    $('#' + _idModalWaitingCurr).modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: false
                    });


                    $('#' + _idModalWaitingHeaderCurr).text(text);
                    $('#' + _idModalWaitingCurr).modal('show');
                    $('#' + _idModalWaitingAnimCurr).css('visibility', 'visible');
                }, 10);
            }

            _shownCallback = cb;
            app.modal.common.renderPartialView(htmlView, function () {
                initModal();
            });
        }

        function hide(cb) {
            _hiddenCallback = cb;
            $('#' + _idModalWaitingAnimCurr).css('visibility', 'hidden');
            $('#' + _idModalWaitingCurr).modal('hide');
        }

        init();

        return {
            show: show,
            hide : hide
        }
    }

    modal.busy = Modal;

})(app.modal);
