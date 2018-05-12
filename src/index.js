import './styles/index.less'
// polyfill
window.THREE = require('three'); 
require('../three/build/JDLoader.min.js')
var _history = require('./router').default

// import currentScene from './router'

function init() {
    var canvas = document.createElement('canvas');
    _history.current.scene.Init(canvas)
    document.body.appendChild(canvas);
}

function animate() {
    requestAnimationFrame( animate );
    _history.current.scene.Render();
}
// 初始化
init();
// 持续渲染
animate();