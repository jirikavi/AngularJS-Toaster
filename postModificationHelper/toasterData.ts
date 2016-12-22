/**
 * Created by Hassan on 12/22/2016.
 */
class ToasterData {
    public type: string;
    public title: string;
    public body: string;
    public toasterId: string;


    constructor(type: string, title: string, body: string, toasterId: string) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.toasterId = toasterId;
    }
}