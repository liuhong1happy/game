
import HomeScene from './scenes/home/index'
import LoadingScene from './scenes/loading/index'

import PlayScene from './scenes/play/index'
import Scene from './core/scenes/scene';
import _history from './core/route/history';

_history.init();
_history.addRoute('/home', new HomeScene());
_history.addRoute('/loading', new LoadingScene());
_history.addRoute('/play', new PlayScene());

_history.push('/loading', { first: true });

export default _history;