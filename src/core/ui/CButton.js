import Component from "./Component";
import CRect from "./CRect";
import CText from "./CText";

export default class CButton extends Component {
    constructor() {
        this.visible = true;
        this.touchable = true;
        this.background = new CRect();
        this.content = new CText("按钮");
        this.isCButton = true;
    }
    setPosition(x, y) {
        super.setPosition(x, y);
        this.background.setPosition(x, y);
        this.content.setPosition(x, y);
    }
    setSize(w, h) {
        super.setSize(w, h);
        this.background.setSize(x, y);
        this.content.setSize(x, y);
    }
    Start() {
        this.loaded = true;
    }

    Update() {
        if(this.visible && this.loaded) {
            this.background.Update();
            this.content.Update();
        }
    }

    End() {}
}