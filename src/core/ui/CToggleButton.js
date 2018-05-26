import CButton from "./CButton";
import EventEmitter from 'events'

export default class CToggleButton extends CButton {
    constructor() {
        super()
        this.toggle = false;
    }

    Start() {
        this.loaded = true;
        this.addEventListener('touchend', this.onTouchEnd)
    }

    setToggle(toggle) {
        this.toggle = toggle;
        this.eventEmitter.emit('change', this.toggle)
    }

    onTouchEnd = ()=>{
        this.Toggle()
    }

    Toggle() {
        this.toggle = !this.toggle;
        this.eventEmitter.emit('change', this.toggle)
    }
}