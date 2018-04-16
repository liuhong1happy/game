require('./weapp-adapter')

GameGlobal.THREE = require('./three/build/three.min')
var _history = require('./src/router').default

function init() {
    _history.current.scene.Init(canvas)
}

function animate() {
    requestAnimationFrame( animate );
    _history.current.scene.Render();
}

// 初始化
init();
// 持续渲染
animate();