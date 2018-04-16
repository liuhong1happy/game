import player from '../models/player'
import CONST from '../consts/index'

export default class EnemyController {

    constructor(scene, camera, playerController) {
        this.scene = scene;
        this.camera = camera;
        this.playerController = playerController;
    }

    max = 20; // 敌人数量最多100个
	born = 1*1000; // 1s 诞生一个敌人
	timestamp = Date.now();
	enemies = [ // 记录当前所有敌人
		{
			typeId: 1, // 预留字段,怪物类型
			direction: 'd',
			position: {
				x: 10,
				y: 10
			},
			targetPosition: {
				x: 11,
				y: 10
			},
			prevPosition: {
				x: 10,
				y: 10
			},
			mesh: null
		}
	];
	random(direction) {
		var dirDic = {
			'w': ['w','a','d'],
			's': ['s','d','a'],
			'a': ['a','s','w'],
			'd': ['d','w','s'],
		}
		// 随机构建用户操作
		var rdmInt = Math.round(Math.random()*1000)%3;
		var dir = dirDic[direction][rdmInt];
		return dir;
	}
	createEnemy(pos) {
		var rdmInt = Math.round(Math.random()*1000)%4;
		var direction = ['w','s','a','d'][rdmInt];
		var dir = CONST.direction[direction];
		var newEnemy = {
			typeId: 1,
			position: {
				x: pos.x,
				y: pos.y
			},
			targetPosition: {
				x: pos.x+dir.x,
				y: pos.y+dir.y
			},
			prevPosition: {
				x: pos.x,
				y: pos.y
			},
			direction: direction,
			mesh: null
		}
		return newEnemy;
	}
	calculate() {
		// 随机计算生成敌人的位置
		if((Date.now() - this.timestamp)>= this.born && this.enemies.length <= this.max) {
			this.timestamp = Date.now();
			var x = Math.round(Math.random()* CONST.gridCount) % CONST.gridCount - CONST.gridCount/2;
			var y = Math.round(Math.random()* CONST.gridCount) % CONST.gridCount - CONST.gridCount/2;
			var pos = { x: x, y: y };
			var distance = this.playerController.distance(pos);

			// 落到玩家的区域内、玩家行驶路线上
			if(this.playerController.outPath(pos) && 
				this.playerController.outBlock(pos) && 
				this.outEnemy(pos) && 
				distance>3 && distance <= 30
			) {
				var newEnemy = this.createEnemy(pos);
				this.enemies.push(newEnemy);
			}
		}
		
		// 计算敌人的下一目的地
		var that = this;
		this.enemies.forEach((enemy)=> {
			var enemyPos = new THREE.Vector2( enemy.position.x, enemy.position.y );
			var targetPos = new THREE.Vector2( enemy.targetPosition.x, enemy.targetPosition.y );
			var prevPos = new THREE.Vector2( enemy.prevPosition.x, enemy.prevPosition.y );
			var distance = enemyPos.distanceTo(targetPos);
			if(distance<= 0.02) {
				var direction = that.random(enemy.direction);
				var dir = CONST.direction[direction];
				var pos = { x: targetPos.x + dir.x, y: targetPos.y + dir.y }
				// 更新现有位置
				enemy.position = { x: targetPos.x, y: targetPos.y }
				// 重新规划下一个目的地
				if(this.playerController.outBlock(pos) && 
					distance>3 && distance <= 50
				) {
					enemy.prevPosition = { x: targetPos.x, y: targetPos.y };
					enemy.targetPosition = pos;
					enemy.direction = direction;
				} else {
					var dirDic = {
						'w': 's',
						's': 'w',
						'a': 'd',
						'd': 'a',
					}
					enemy.prevPosition = { x: targetPos.x, y: targetPos.y };
					enemy.targetPosition = { x: prevPos.x, y: prevPos.y };
					enemy.direction = dirDic[enemy.direction];
				}
			} else {
				enemy.position = { x: enemyPos.x + (targetPos.x - enemyPos.x)*CONST.enemyV, y: enemyPos.y + (targetPos.y - enemyPos.y)*CONST.enemyV }
			}
		})
	}
	drawEnemies() {
		// 获取新的敌人
		// 更新敌人位置
		var newEnemies = this.enemies.filter(function(enemy) {
			var isNew = enemy.mesh === null;
			if(!isNew) {
				enemy.mesh.position.x = enemy.position.x;
				enemy.mesh.position.y = enemy.position.y;
			}
			return isNew;
		})

		// 生成新的敌人
		newEnemies.forEach((enemy)=> {
			var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
			var material = new THREE.MeshBasicMaterial({ color: '#99ff00', wireframe: true });
			
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = enemy.position.x;
			mesh.position.y = enemy.position.y;
			mesh.position.z = 0.1;
			enemy.mesh = mesh;
			this.scene.add(enemy.mesh);
		})
		
	}
	// 判断某一点是否有怪物活动
	outEnemy(position) {
		return this.enemies.filter(function(enemy) { return enemy.targetPosition.x === position.x && enemy.targetPosition.y === position.y }).length===0
	}
}