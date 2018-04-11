export default class DebugUIController {
    dom =  document.createElement('div');
    constructor(playerController, enemyController) {
        this.enemyController = enemyController;
        this.playerController = playerController;
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
		].join('\n');
	}
}