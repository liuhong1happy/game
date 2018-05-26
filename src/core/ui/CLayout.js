import Component from "./Component";

export default class CLayout extends Component {
    constructor() {
        super()
        this.visible = true;
        this.gutter = { h: 0, v: 0 }
        this.layout = { d: 'h', h: 'center', v: 'center' }
        this.children = [];
    }

    setLayout({ h, v}) {
        this.layout = { d, h, v };
    }

    setGutter({ h, v}) {
        this.gutter = { h, v };
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
        const visibleChildren = this.children.filter(child=> child.visible);
        if(this.layout.d === 'h') {
            // 计算所有组件的总宽度
            const sumWidth = visibleChildren.reduce((preV, curItem, curIndex, array)=>{
                return preV + curItem.width;
            }, 0) + (visibleChildren.length - 1) + this.gutter.h;
            // 计算起始x
            let startX;
            switch (this.layout.h) {
                case 'center':
                    startX = this.x + (this.width - sumWidth) / 2
                    break;
                case 'left':
                    startX = this.x
                    break;
                case 'right':
                    startX = this.x + this.width - sumWidth;
                    break;
                default:
                    startX = this.x + (this.width - sumWidth) / 2
                    break;
            }
            // 设置子组件位置
            visibleChildren.forEach(child=>{
                var x = startX, y;
                switch (this.layout.v) {
                    case 'center':
                        y = this.y + this.height / 2 - child.height /2;
                        break;
                    case 'top':
                        y = this.y
                        break;
                    case 'bottom':
                        y = this.y + this.height - child.height;
                        break;
                    default:
                        y = this.y + this.height / 2 - child.height /2;
                        break;
                }
                child.setPosition(x, y);
                startX = x + child.width + this.gutter.h;
            })
        } else {
            // 计算所有组件的总高度
            const sumHeight = visibleChildren.reduce((preV, curItem, curIndex, array)=>{
                return preV + curItem.height;
            }, 0) + (visibleChildren.length - 1) + this.gutter.v;
            // 计算起始y
            switch (this.layout.v) {
                case 'center':
                startY = this.y + (this.height - sumHeight) / 2;
                    break;
                case 'top':
                startY = this.y
                    break;
                case 'bottom':
                startY = this.y + this.height - sumHeight;
                    break;
                default:
                startY = this.y + this.height / 2 - sumHeight /2;
                    break;
            }
            // 计算中间x
            let middleX = this.x + this.width / 2;
            // 设置子组件位置
            visibleChildren.forEach(child=>{
                var x, y = startY;
                switch (this.layout.h) {
                    case 'center':
                        x = this.x + (this.width - child.width) / 2
                        break;
                    case 'left':
                        x = this.x
                        break;
                    case 'right':
                        x = this.x + this.width - child.width;
                        break;
                    default:
                        x = this.x + (this.width - child.width) / 2
                        break;
                }
                child.setPosition(x, y);
                startY = x + child.height + this.gutter.v;
            })
        }
        // 更新组件
        visibleChildren.forEach(child=>{
            if(!child.loaded) {
                child.parent = this;
                child.context = this.context;
                child.Start()
            }
            else child.Update()
        })
    }

    End() {

    }
}