import * as THREE from 'three'

export default class Scene {
    constructor() {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 )
        this.scene = new THREE.Scene()
    }
    Init(renderer) {
        this.renderer = renderer;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        window.addEventListener( 'resize', this.onWindowResize, false );
        this.Start(renderer);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        this.Update();
        this.renderer.render( this.scene, this.camera );
    }
    Update() {
        // 允许被替换覆写
    }
    Unload() {
        window.removeEventListener( 'resize', this.onWindowResize, false );
        this.End();
    }
    End() {
        // 允许被替换覆写
    }
    // size事件触发
    onWindowResize() {
        if(this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
}