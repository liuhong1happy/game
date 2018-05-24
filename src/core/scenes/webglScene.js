import Scene from './scene'

export default class WebGLScene extends Scene {
    constructor() {
        super();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 )
        this.scene = new THREE.Scene()
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d');
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight)
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        // this.renderer = new THREE.CanvasRenderer( { antialias: true, canvas } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.Start(this.renderer);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        this.Update();
        if(this.renderer)
            this.renderer.render( this.scene, this.camera );
        this.context.drawImage(this.renderer.domElement, 0, 0)
        super.Render();
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