require('./weapp-adapter')

GameGlobal.THREE = require('./three/build/three.min')
var currentScene = require('./src/router').default

function init() {
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.setSize(window.innerWidth, window.innerHeight );
    currentScene.Init(renderer)
}

function animate() {
    requestAnimationFrame( animate );
    currentScene.Render();
}

// 初始化
init();
// 持续渲染
animate();