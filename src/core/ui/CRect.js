import Component from "./Component";

export default class CRect extends Component {
    constructor() {
        super()
        this.visible = true;
        this.backgroundColor = 'black';
        this.isCRect = true;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
    }
    Start() {
        this.loaded = true;
    }

    Update() {
        if(this.visible && this.loaded && this.img) {
            this.context.fillStyle = this.backgroundColor;
            this.context.react(this.x, this.y, this.width, this.height);
            this.context.fill()
        }
    }

    End() {}
}