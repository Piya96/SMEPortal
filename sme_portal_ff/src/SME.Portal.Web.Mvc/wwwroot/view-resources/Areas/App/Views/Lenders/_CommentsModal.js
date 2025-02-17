(function ($) {

    app.modals.CommentsLenderModal = function () {

        var _lendersService = abp.services.app.lenders;

        var _modalManager;
        var _$lenderCommentForm = null;

        function deleteItem(commentId) {
            var deletemodel = $('#confirmDeleteModal').modal();
            $('#deleteId').on('click', function () {
                _lendersService.deleteComments({
                    id: commentId
                }).done(function () {
                    abp.notify.info(app.localize('DeletedSuccessfully'));
                    deletemodel.modal("hide");
                    $('.modal-backdrop').hide();
                });
            });
        }

        this.init = function (modalManager) {
            _modalManager = modalManager;

            var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$lenderCommentForm = _modalManager.getModal().find('form[name=CommentForm]');
            _$lenderCommentForm.validate();
            $('.deleteComments').on('click', function () {
                var commentId = $(this).data("commentid");
                deleteItem(commentId);
            });
        };

        //important - checking valid or invalid form
        this.save = async function () {
            // console.log("Adding Comments on save");
            if (!_$lenderCommentForm.valid()) {
                return;
            }
            
            var lenderComments = _$lenderCommentForm.serializeFormToObject();
            // console.log("lenderComments", lenderComments);
            _modalManager.setBusy(true);
            _lendersService.createComment(
                lenderComments
            ).done(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                _modalManager.close();
                $('#trumbowyg-icons').hide();
                abp.event.trigger('app.createCommentLenderModalSaved');
            }).always(function () {
                _modalManager.setBusy(false);
            });
        };
    };
})(jQuery);