function InitTrumbowygTab() {
    $('.trumbowyg-editor').keydown(function (event) {

        if (event.which === 9) {
            event.preventDefault();
            if (event.shiftKey) {

                $('#' + event.currentTarget.nextSibling.id).trumbowyg('execCmd',
                    {
                        cmd: 'outdent',
                        param: null,
                        forceCss: false
                    });
            } else {
                $('#' + event.currentTarget.nextSibling.id).trumbowyg('execCmd',
                    {
                        cmd: 'indent',
                        param: null,
                        forceCss: false
                    });
            }
        }
    });
}