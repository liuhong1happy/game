import Component from "./Component";
import CRect from "./CRect";
import CText from "./CText";

export default class CButton extends Component {
    constructor() {
        super()
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
        this.background.setSize(w, h);
        this.content.setSize(w, h);
    }
    Start() {
        this.loaded = true;
    }

    Update() {
        if(this.visible && this.loaded) {
            this.updateChildren()
        }
    }

    updateChildren() {
        const children = [ this.background, this.content]
        const visibleChildren = children.filter(child=> child.visible);
        visibleChildren.forEach(child=>{
            if(!child.loaded) {
                child.parent = this;
                child.context = this.context;
                child.Start()
            }
            else child.Update()
        })
    }

    End() {}
}