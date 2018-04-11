import './styles/index.less'
import * as THREE from 'three'
import currentScene from './router'
// polyfill
window.THREE = THREE; 

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