(function () {

    app.modals.flexiEdit = function () {

        let _cb = null;

        $('#id-appication-matching-flexi-edit-modal').modal({
            backdrop: 'static',
            keyboard: true,
            show: false
        });

        function onSave(cb) {
            if (cb != null) {
                cb('Save');
            }
        }

        function init(cb) {
            _cb = cb;
            $('#id-modal-save').click(onSave.bind(this, _cb));
        }

        function show(cb) {
            $('#id-appication-matching-flixi-edit-modal').modal('show');
        }

        function hide(cb) {
            $('#id-appication-matching-flixi-edit-modal').modal('hide');
        }

        function open(cb) {

        }

        function close(cb) {

        }

        $('#id-appication-matching-flixi-edit-modal').on('hidden.bs.modal', function () {
            if (_cb != null) {
                _cb('Hide');
            }
        });

        return {
            init : init,
            open: open,
            close: close,
            show: show,
            hide : hide
        };
    };

})();


(function ($) {
    app.modals.FlexiEditModal = function () {

        var _applicationsService = abp.services.app.applications;

        var _modalManager;
        var _$flexiEditForm = null;

        var _FlexiEditModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Controllers/FundingApplication/Index'
        });

        //let modal = _
        this.init = function (modalManager) {
            _modalManager = modalManager;


        };

        this.save = function () {
            if (!_$flexiEditForm.valid()) {
                return;
            }
            
            //var application = _$flexiEditForm.serializeFormToObject();

            //_modalManager.setBusy(true);

            //_applicationsService.createOrEdit(
            //    application
            //).done(function () {
            //    abp.notify.info(app.localize('SavedSuccessfully'));
            //    _modalManager.close();
            //    abp.event.trigger('app.createOrEditApplicationModalSaved');
            //}).always(function () {
            //    _modalManager.setBusy(false);
            //});
        };
    };

    app.modals.FlexiEditModal();
})(jQuery);