import Scene from "./scene";

export default class WebGLScene extends Scene {
    /** 3D场景 */
    protected scene: THREE.Scene;
    /** 3D相机 */
    protected camera: THREE.Camera;
    /** 3D渲染器 */
    protected renderer: THREE.Renderer;
    /** 窗口大小变化 */
    private onWindowResize():void
}