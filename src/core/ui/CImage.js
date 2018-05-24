import Component from "./Component";
/**
 * 图片组件
 */
export default class CImage extends Component {
    /**
     * 图片组件构造函数
     * @param {string} source 
     * @param {function} callback 构建完成的回调函数
     */
    constructor(source, callback = false) {
        super();
        // 组件默认展示
        this.visible = true;
        // 图片资源路径
        this.source = source;
        // 回调函数
        this.callback = callback;
        this.isCImage = true;
    }
    /** 重新设置图片资源路径 */
    setSource(source, callback = false) {
        // 卸载已经加载的图片
        if(this.img) {
            this.img.remove()
        }
        // 重新绘制
        var self = this;
        var img = document.createElement('img');
        img.onload = () => {
            self.loaded = true;
            if(this.callback) {
                this.callback()
            }
        }
        img.src = source;
        this.source = source;
        this.callback = callback;
        this.img = img;
    }

    Start() {
        var self = this;
        var img = document.createElement('img');
        img.onload = () => {
            self.loaded = true;
            if(this.callback) {
                this.callback()
            }
        }
        img.src = this.source;
        this.img = img;
    }

    Update() {
        if(this.visible && this.loaded && this.img) {
            this.context.drawImage(this.img,this.x,this.y, this.width, this.height);
        }
    }

    End() {
        this.img.remove();
    }
}