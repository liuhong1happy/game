import EventEmitter from 'events'

export default class Component {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 30;
        this.visible = false; // 基础组件默认不展示
        this.loaded = false; // 组件默认处于未加载状态
        this.touchable = false; // 组件是否接受触屏事件
        this.touched = false; // 是否触摸到组件
        this.eventEmitter = new EventEmitter(); // 事件触发器
        this.isComponent = true;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    setSize(w, h) {
        this.width = w;
        this.height = h;
    }
    
    Start() {

    }
    Update() {

    }
    End() {

    }
    /**
     * 判断是否在组件内部
     * @param {object} position 
     * @param {number} position.x
     * @param {number} position.y 
     */
    isScope({ x, y }) {
        return x>=this.x && x<=(this.x+this.width) && y>= this.y && y<= (this.y+this.height);
    }
    /**
     * 添加事件
     * @param {string} type 
     * @param {function} listener 
     */
    addEventListener(type, listener) {
        if(this.touchable) {
            this.eventEmitter.on(type, listener);
        }
    }
    /**
     * 移除事件
     * @param {string} type 
     * @param {function} listener 
     */
    removeEventListener(type, listener) {
        if(this.touchable) {
            this.eventEmitter.removeListener(type, listener)
        }
    }
    /**
     * 触发TouchMove事件
     * @param {Event} evt 
     */
    emitTouchMove(evt) {
        if(this.touchable) {
            this.eventEmitter.emit('touchmove', evt);
            console.log('component', 'touchmove', evt)
        }
    }
    /**
     * 触发TouchStart事件
     * @param {Event} evt 
     */
    emitTouchStart(evt) {
        if(this.touchable) {
            this.touched = true;
            this.eventEmitter.emit('touchstart', evt);
            console.log('component', 'touchstart', evt)
        }
    }
    /**
     * 触发TouchEnd事件
     * @param {Event} evt 
     */
    emitTouchEnd(evt) {
        if(this.touchable) {
            this.touched = false;
            this.eventEmitter.emit('touchend', evt);
            console.log('component', 'touchend', evt)
        }
    }
}