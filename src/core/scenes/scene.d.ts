import BaseComponent from "../ui/BaseComponent";

export default class Scene {
    /** 2D场景 */
    protected canvas: HTMLCanvasElement;
    /** 2D绘制上下文 */
    protected context: CanvasRenderingContext2D;
    /** 子元素 */
    protected children: Array<BaseComponent>;
    /** 构造函数，初始化相机和场景 */
    constructor()
    /** 初始化场景 */
    public Init(canvas: HTMLCanvasElement):void
    /** 场景开始渲染 */
    protected Start():void
    /** 渲染场景 */
    public Render():void
    /** 更新渲染 */
    protected Update():void
    /** 卸载场景 */
    public Unload():void
    /** 离开场景 */
    protected End():void
    /** 渲染组件 */
    protected updateChildren():void
}