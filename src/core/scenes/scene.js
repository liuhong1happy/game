export default class Scene {
    constructor() {
        this.params = {};
        this.touched = false;
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d', { antialias: true });
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight);
        this.children = [];

        this.canvas.addEventListener('touchstart', this.onTouchStart)
        this.canvas.addEventListener('touchmove', this.onTouchMove)
        this.canvas.addEventListener('touchend', this.onTouchEnd)

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
        this.canvas.removeEventListener('touchstart', this.onTouchStart)
        this.canvas.removeEventListener('touchmove', this.onTouchMove)
        this.canvas.removeEventListener('touchend', this.onTouchEnd)
        this.End();
    }
    End() {
        // 允许被替换覆写
    }


    onTouchStart = (evt)=> {
        console.log('touchstart', evt);
        const touches = evt.touches;
        if(touches.length>=0) {
            this.touched = true;
            const touchPosition = {x: touches[0].pageX, y: touches[0].pageY }
            const children = this.children.filter(child=> child.touchable && child.isScope(touchPosition));
            children.forEach(child=>{
                child.emitTouchStart(evt);
            })
        }
    };

    onTouchMove = (evt)=> {
        console.log('touchmove', evt);
        if(this.touched) {
            const touches = evt.touches;
            if(touches.length>=0) {
                const touchPosition = {x: touches[0].pageX, y: touches[0].pageY }
                const children = this.children.filter(child=> child.touchable && child.touched);
                children.forEach(child=>{
                    child.emitTouchMove(evt);
                })
            }
        }
    }

    onTouchEnd = (evt)=> {
        console.log('touchend',evt);
        this.touched = false;
        const children = this.children.filter(child=> child.touchable && child.touched);
        children.forEach(child=>{
            child.emitTouchEnd(evt);
        })
    }
}