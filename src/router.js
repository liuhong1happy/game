
import HomeScene from './scenes/home'
import LoadingScene from './scenes/loading'
import PlayScene from './scenes/play'

import * as THREE from 'three';
import Scene from './scenes/scene';

const scenes = {
    '/home': new HomeScene(),
    '/loading': new LoadingScene(),
    '/play': new PlayScene(),
    '/404': new Scene()
}

const currentScene = scenes['/play'];

export default currentScene;



