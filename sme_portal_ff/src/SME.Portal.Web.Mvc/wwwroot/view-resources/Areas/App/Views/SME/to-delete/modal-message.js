if (typeof sme == 'undefined') {
    var sme = {};
}
// --- Add seetalert2 modal popups to global context.
sme.swal = {
    close: function () {
        if (swal.isVisible() == true) {
            swal.close();
        }
    },
    common: function (title, text, confirm, cb, icon, escape, click = null) {
        this.close();
        swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonText: "Ok, got it!",
            allowOutsideClick: click == null ? false : click,
            allowEscapeKey: escape,
            showConfirmButton: confirm
        }).then(cb == null ? function () { } : cb());
    },
    success: function (title, text, confirm, cb = null) {
        this.close();
        this.common(title, text, confirm, cb, 'success', false);
    },
    success2: function (title, text, confirm, cb = null) {
        this.close();
        this.common(title, text, confirm, cb, 'success', true, true);
    },
    info: function (title, text, confirm, cb = null) {
        this.close();
        this.common(title, text, confirm, cb, 'info', false);
    },
    warning: function (title, text, confirm, cb = null) {
        this.close();
        this.common(title, text, confirm, cb, 'warning', false);
    },
    error: function (title, text, confirm, cb = null) {
        this.close();
        this.common(title, text, confirm, cb, 'error', false);
    }
};
