/**
 * Created by Hassan on 12/22/2016.
 */
class ErrorHandler {
    private static instance: ErrorHandler;

    static initialize(): void {
        ErrorHandler.instance = new ErrorHandler();
    }

    public static getInstance(): ErrorHandler {
        return ErrorHandler.instance;
    }


    constructor() {
        this.visibleDialogList = new Array<any>();
    }


    private visibleDialogList: Array<any>;

    public pop(toaster, data: ToasterData): void {
        var self = this;
        var found = Enumerable.from(self.visibleDialogList).firstOrDefault(
            function (w) {
                return w.type == data.type
                    && w.title == data.title
                    && w.body == data.body
                    && w.toasterId == data.toasterId;
            },
            null);

        if(!Util.Utility.isNullOrUndefined(found)){
            found.count++;
            var existToast = found.toastRef;
            var description = "";
            switch(data.type){
                case "info":
                case "success":
                    description = "This Message Repeated "+found.count+ " times.";
                    break;
                case "warning":
                    description="This Warning Repeated "+found.count+ " times.";
                    break;
                case "error":
                    description="This Error Repeated "+found.count+ " times.";
                    break;
            }

            existToast.body = data.body + "<br/><br/>" + description;
        }else {
            var toasterResult = toaster.pop({
                type: data.type,
                title: data.title,
                body: data.body,
                toasterId: data.toasterId,
                bodyOutputType: 'trustedHtml',
                onHideCallback: function () {
                    self.visibleDialogList.remove(null, function (w: any) {
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
    }
}
//Call static Constructor
ErrorHandler.initialize();