export default class Scene {
    /** 3D场景 */
    protected scene: THREE.Scene;
    /** 3D相机 */
    protected camera: THREE.Camera;
    /** 3D渲染器 */
    protected renderer: THREE.Renderer;
    /** 构造函数，初始化相机和场景 */
    constructor()
    /** 初始化场景 */
    public Init(renderer: THREE.Renderer):void
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
    /** 窗口大小变化 */
    private onWindowResize():void
}