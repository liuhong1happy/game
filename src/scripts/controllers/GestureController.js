const Dirs = {
    d: [0,90],
    w: [90,180],
    a: [-180,-90],
    s: [-90, 0]
}


export default class GestureController {
    constructor(){
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.direction = 'c';
    }
    /** 添加监听事件 */
    init() {
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        window.addEventListener('touchstart', this.onTouchStart)
        window.addEventListener('touchmove', this.onTouchMove)
        window.addEventListener('touchend', this.onTouchEnd)
    }
    /** 卸载监听事件 */
    unload() {
        window.removeEventListener('touchstart', this.onTouchStart)
        window.removeEventListener('touchmove', this.onTouchMove)
        window.removeEventListener('touchend', this.onTouchEnd)
    }
    onTouchStart(e) {
        e.preventDefault();
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }
     //返回角度

    GetSlideAngle(dx,dy) {
        return Math.atan2(dy,dx) * 180 / Math.PI;
    }

    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection() {
        var dy = this.startY - this.endY;
        var dx = this.endX - this.startX;
        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
           return null;
        }
        var angle = this.GetSlideAngle(dx, dy);
        var direction = 'c';
        Object.keys(Dirs).forEach(key=>{
            if(angle >= Dirs[key][0] && angle <= Dirs[key][1]) {
                direction = key;
            }
        })
        return direction;
    }
    onTouchMove(e) {
        e.preventDefault();
        this.endX = e.changedTouches[0].pageX;
        this.endY = e.changedTouches[0].pageY;
    }
    onTouchEnd(e) {
        e.preventDefault();
        this.direction = this.GetSlideDirection();
    }
}