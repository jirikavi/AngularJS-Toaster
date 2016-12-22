/**
 * Created by Hassan on 12/22/2016.
 */
var ToasterData = (function () {
    function ToasterData(type, title, body, toasterId) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.toasterId = toasterId;
    }
    return ToasterData;
}());
