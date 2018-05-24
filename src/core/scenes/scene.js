export default class Scene {
    constructor() {
        this.params = {};
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d', { antialias: true });
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight);
        this.children = [];
        this.Start(canvas);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        // 更新场景
        this.Update();
        // 更新组件
        this.updateChildren();
    }
    updateChildren() {
        const visibleChildren = this.children.filter(child=> child.visible);
        visibleChildren.forEach(child=>{
            if(!child.loaded) {
                child.parent = this;
                child.context = this.context;
                child.Start()
            }
            else child.Update()
        })
    }
    Update() {
        // 允许被替换覆写
    }
    Unload() {
        this.End();
    }
    End() {
        // 允许被替换覆写
    }
}