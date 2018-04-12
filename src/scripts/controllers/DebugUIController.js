import player from '../models/player'

const Dirs = {
	'w': '北',
	'd': '东',
	'a': '西',
	's': '南',
	'c': '保持当前方向'
}

export default class DebugUIController {
    constructor(playerController, enemyController, gestureController) {
        this.enemyController = enemyController;
		this.playerController = playerController;
		this.gestureController = gestureController;
		this.dom =  document.createElement('div');
    }
	init() {
		this.dom.style.position = 'absolute';
		this.dom.style.top = 0;
		this.dom.style.right = 0;
		this.dom.style.padding = '10px';
		this.dom.style.backgroundColor = 'rgba(255,255,255,0.3)';
		this.dom.style.color = 'rgb(255,255,255)';
		document.body.appendChild(this.dom);
	}
	update() {
		this.dom.innerText = [
			'敌人数量:'+ this.enemyController.enemies.length+'个',
			'圈地数量:'+ this.playerController.blocks.length+'格',
			'当前行驶方向:' + Dirs[player.direction],
			'准备切换方向:' + Dirs[this.gestureController.direction]
		].join('\n');
	}
}