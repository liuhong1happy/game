
import HomeScene from './scenes/home/index'
import LoadingScene from './scenes/loading/index'
import PlayScene from './scenes/play/index'
import Scene from './scenes/scene';

// 路由配置
const scenes = {
    '/home': new HomeScene(),
    '/loading': new LoadingScene(),
    '/play': new PlayScene(),
    '/404': new Scene()
}

const currentScene = scenes['/play'];

export default currentScene;



