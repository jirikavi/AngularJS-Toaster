/**
 * Created by Hassan on 12/22/2016.
 */
var ErrorHandler = (function () {
    function ErrorHandler() {
        this.visibleDialogList = new Array();
    }
    ErrorHandler.initialize = function () {
        ErrorHandler.instance = new ErrorHandler();
    };
    ErrorHandler.getInstance = function () {
        return ErrorHandler.instance;
    };
    ErrorHandler.prototype.pop = function (toaster, data) {
        var self = this;
        var found = Enumerable.from(self.visibleDialogList).firstOrDefault(function (w) {
            return w.type == data.type
                && w.title == data.title
                && w.body == data.body
                && w.toasterId == data.toasterId;
        }, null);
        if (!Util.Utility.isNullOrUndefined(found)) {
            found.count++;
            var existToast = found.toastRef;
            var description = "";
            switch (data.type) {
                case "info":
                case "success":
                    description = "This Message Repeated " + found.count + " times.";
                    break;
                case "warning":
                    description = "This Warning Repeated " + found.count + " times.";
                    break;
                case "error":
                    description = "This Error Repeated " + found.count + " times.";
                    break;
            }
            existToast.body = data.body + "<br/><br/>" + description;
        }
        else {
            var toasterResult = toaster.pop({
                type: data.type,
                title: data.title,
                body: data.body,
                toasterId: data.toasterId,
                bodyOutputType: 'trustedHtml',
                onHideCallback: function () {
                    self.visibleDialogList.remove(null, function (w) {
                        return toasterResult.toastId == w.toastId
                            && toasterResult.toasterId == w.toasterId;
                    }, 'all');
                }
            });
            self.visibleDialogList.push({
                toastId: toasterResult.toastId,
                toasterId: toasterResult.toasterId,
                toastRef: toaster.toast,
                type: data.type,
                title: data.title,
                body: data.body,
                count: 1,
            });
        }
    };
    return ErrorHandler;
}());
//Call static Constructor
ErrorHandler.initialize();
