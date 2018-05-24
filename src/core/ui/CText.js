import BaseComponent from "./BaseComponent";

export default class CText extends BaseComponent {

    constructor(text) {
        super()
        this.content = text;
        this.textAlign = "left";
        this.textAlignVertical = "top";
        this.fontSize = 12;
        this.fontFamily = "Arial";
        this.color = 'black';
        this.visible = true;
        
        this._x = 0;
        this._y = 0;
        this._font = this.fontSize +"px " + this.fontFamily;
    }

    setContent(text) {
        this.content = text;
    }
    Start() {
        this.loaded = true;
    }

    calculate() {
        this._font = this.fontSize +"px " + this.fontFamily;
        this._height = this.fontSize + 2;
        this._width = this.context.measureText(this.content).width;
        
        switch (this.textAlign) {
            case 'left':
                this._x = this.x;
                break;
            case 'right':
                this._x = this.x + this.width - this._width;
                break;
            case 'center':
                this._x = this.x + (this.width - this._width) /2;
                break;
            default:
                this._x = this.x;
                break;
        }
        switch (this.textAlignVertical) {
            case 'top':
                this._y = this.y + this._height / 2;
                break;
            case 'bottom':
                this._y = this.y + (this.height - this._height / 2)
                break;
            case 'center':
                this._y = this.y + this.height / 2 + this._height / 2;
                break;
            default:
                this._y = this.y;
                break;
        }

    }

    Update() {
        if(this.visible && this.loaded && this.content) {
            this.calculate();
            this.context.font = this._font;
            this.context.fillStyle = this.color;
            this.context.fillText(this.content, this._x, this._y);
        }
    }

    End() {

    } 
}