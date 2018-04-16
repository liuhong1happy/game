import './styles/index.less'
// polyfill
window.THREE = require('three'); 
var currentScene = require('./router').default

// import currentScene from './router'

function init() {
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
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