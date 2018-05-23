export default class WebGLScene extends Scene {
    /** 3D场景 */
    protected scene: THREE.Scene;
    /** 3D相机 */
    protected camera: THREE.Camera;
    /** 3D渲染器 */
    protected renderer: THREE.Renderer;
    /** 窗口大小变化 */
    private onWindowResize():void

    /** 2D场景 */
    protected canvas: HTMLCanvasElement;
    /** 2D绘制上下文 */
    protected context: CanvasRenderingContext2D;
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
}