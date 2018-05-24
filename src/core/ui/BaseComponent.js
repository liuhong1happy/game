export default class BaseComponent {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 30;
        this.visible = false; // 基础组件默认不展示
        this.loaded = false; // 组件默认处于未加载状态
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
}