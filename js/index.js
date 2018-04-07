var camera, scene, renderer;
var geometry, material, mesh, pathMesh, areaMesh;

var CONST = {
	direction : {
		w: { x: 0, y: 1 },
		s: { x: 0, y: -1 },
		a: { x: 1, y: 0 },
		d: { x: -1, y: 0 }
	},
	gridCount: 200,
	enemyV: 0.005,
	palyerV: 0.009,
}

// 保存当前玩家位置和方向数据
var player = {
	direction: 'w',
	position: {
		x: 0,
		y: 0
	},
	hasFirstArea: false,
}

// 计算玩家位置、方向、区域等
var playerController = {
	direction: 's',
	position: {
		x: 0,
		y: 0
	},
	path: [{x:0,y:0,z:0.01}],
	areas: [], // 所有围成的区域
	blocks: [],
	addBlocks(blocks) {
		var canInsertBlocks = [];
		this.blocks.forEach(function(oldBlock) {
			var index = blocks.findIndex(function(newBlock) { return newBlock.point1.x === oldBlock.point1.x && newBlock.point1.y === oldBlock.point1.y });
			if(index!==-1) blocks.splice(index, 1);
		})
		this.blocks = this.blocks.concat(blocks);
		console.log('this.blocks', this.blocks);
	},
	addArea(points) {
		// 加入区域
		var area = {
			points,
			mesh: null
		}
		// 计算新增区域中的所有格子数量
		// 1. 计算区域范围
		var firstPoint = area.points[0];
		var maxX = firstPoint.x, maxY = firstPoint.y, minX = firstPoint.x, minY = firstPoint.y;
		area.points.forEach(function(point) {
			if(point.x>maxX) maxX = point.x;
			if(point.y>maxY) maxY = point.y;
			if(point.x<minX) minX = point.x;
			if(point.y<minY) minY = point.y;
		})
		// 2. 计算相交数,奇数次相交则在区域内
		var blocks = [];
		var pCount = area.points.length;
		for(x=minX;x<=maxX;x++) {
			var intCount = -1;
			for(y=maxY;y>minY;y--) {
				var block = {
					point1: {x: x, y: y },
					point2: {x: x+1, y: y },
					point3: {x: x+1, y: y+1 },
					point4: {x: x, y: y+1 },
					mesh: null
				}
				var samePoints = area.points.filter(function(p, index) {
					var prevPoint = area.points[(pCount+index-1)%pCount];
					var nextPoint = area.points[(pCount+index+1)%pCount];
					return (block.point1.x === p.x && block.point1.y === p.y) && ((block.point2.x === prevPoint.x && block.point2.y===prevPoint.y) || (block.point2.x === nextPoint.x && block.point2.y===nextPoint.y))
				})
				if(samePoints.length===1) {
					// 表示和块中心点相交
					intCount = intCount+1;
				}
				if(intCount%2===0) {
					blocks.push(block);
				}
			}
		}
		console.log('blocks', blocks);
		this.addBlocks(blocks);
		this.areas.push(area);
	},
	drawArea(){
		const newAreas = this.areas.filter(function(area){ return area.mesh === null; });
		newAreas.forEach(function(area) {
			var shape = new THREE.Shape();
			area.points.forEach(function(point, index) {
				index === 0 ? shape.moveTo(point.x, point.y) : shape.lineTo(point.x, point.y)
			})
			var geometry = new THREE.ShapeGeometry( shape );
			var material = new THREE.MeshBasicMaterial( { color: 0xFFE69A } );
			area.mesh = new THREE.Mesh( geometry, material ) ;
			area.mesh.position = { x: 0, y: 0, z: 0.02 }
			scene.add(area.mesh);
		})
	},
	calculate() {
		// 计算是否有一格的距离
		var distance = Math.sqrt(Math.pow(player.position.x - this.position.x, 2) + Math.pow(player.position.y - this.position.y, 2))
		// 如果距离大于1,进行相关逻辑计算
		if(distance>=1) {
			// 随机用户方向
			this.random();
			// 用户运动方向判断
			var sameDir = player.direction === this.direction;
			// 更新用户位置
			player.position = { x: Math.round(this.position.x), y: Math.round(this.position.y) }
			// 如果当前用户方向与之前方向不一致,则变向
			if(!sameDir) {
				player.direction = this.direction;
				// 坐标可能有误差,重置位置
				this.position = { x: player.position.x, y: player.position.y };
			}
			// 在行驶路径中查找是否有该点
			var findIndex = this.path.findIndex(function(item) {
				return item.x === player.position.x && item.y === player.position.y;
			})
			
			if(findIndex!==-1) {
				// 如果查找到
				const deleteArea = this.path.splice(findIndex+1, this.path.length - findIndex);
				deleteArea.push({
					x: player.position.x,
					y: player.position.y,
					z: 0.01
				});
				if(deleteArea.length>=4) {
					// 如果刚好围成区域,则新建区域
					// todo 生成动画或者播放声音
					this.addArea(deleteArea);
					// 重置路径
					this.path = [{
						x: player.position.x,
						y: player.position.y,
						z: 0.01
					}];
				}
			} else {
				// 如果未查找到
				this.path.push({
					x: player.position.x,
					y: player.position.y,
					z: 0.01
				})
			}

			console.log(player.position, this.path);
			// 计算线路是否闭合为区域

		}
	},
	random() {
		var dirDic = {
			'w': ['w','a','d'],
			's': ['s','d','a'],
			'a': ['a','s','w'],
			'd': ['d','w','s'],
		}
		// 随机构建用户操作
		var rdmInt = Math.round(Math.random()*1000)%3;
		var dir = dirDic[this.direction][rdmInt];
		this.direction = dir;
	},
	applyMesh(obj) {
		obj.position.x = this.position.x;
		obj.position.y = this.position.y;
	},
	applyCamera(camera) {
		camera.position.x = this.position.x-10;
		camera.position.y = this.position.y-10;
		camera.position.z = 10*Math.sqrt(3)/2;
		camera.up = new THREE.Vector3(0.5, 0.5, 0)
		camera.lookAt( this.position.x, this.position.y, 0 );
	},
	update(obj) {
		this.position.x = obj.position.x;
		this.position.y = obj.position.y;
	},
	drawPath() {
		if(this.path.length>1) {
			if(!pathMesh) {
				pathMesh = new THREE.LineSegments( pathGeometry(this.path), new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 0.3, gapSize: 0.1, linewidth: 2 } ) );
				pathMesh.computeLineDistances();
				scene.add(pathMesh);
			} else {
				pathMesh.geometry = pathGeometry(this.path);
				pathMesh.computeLineDistances();
			}
			pathMesh.visible = true;
		} else {
			if(pathMesh) pathMesh.visible = false;
		}
	},
	// 判断某一点是否可以生成怪物
	outBlock(position) {
		return this.blocks.filter(function(block) {
			return (block.point1.x === position.x && block.point1.y === position.y) || (block.point3.x === position.x && block.point3.y === position.y)
		}).length === 0;
	},
	// 计算位置到玩家的距离
	distance(position) {
		return Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2))
	},
	outPath(position) {
		return this.path.filter(function(point) {
			return (point.x === position.x && point.y === position.y)
		}).length === 0;
	}
}

// 记录所有敌人
var enemyController = {
	max: 20, // 敌人数量最多100个
	born: 1*1000, // 1s 诞生一个敌人
	timestamp: Date.now(),
	enemies: [ // 记录当前所有敌人
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
	], 
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
	},
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
	},
	calculate() {
		// 随机计算生成敌人的位置
		if((Date.now() - this.timestamp)>= this.born && this.enemies.length <= this.max) {
			this.timestamp = Date.now();
			var x = Math.round(Math.random()* CONST.gridCount) % CONST.gridCount - CONST.gridCount/2;
			var y = Math.round(Math.random()* CONST.gridCount) % CONST.gridCount - CONST.gridCount/2;
			var pos = { x: x, y: y };
			var distance = playerController.distance(pos);

			// 落到玩家的区域内、玩家行驶路线上
			if(playerController.outPath(pos) && 
				playerController.outBlock(pos) && 
				this.outEnemy(pos) && 
				distance>3 && distance <= 30
			) {
				var newEnemy = this.createEnemy(pos);
				this.enemies.push(newEnemy);
			}
		}
		
		// 计算敌人的下一目的地
		var that = this;
		this.enemies.forEach(function(enemy) {
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
				if(playerController.outBlock(pos) && 
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
	},
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
		newEnemies.forEach(function(enemy) {
			var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
			var material = new THREE.MeshBasicMaterial({ color: '#99ff00', wireframe: true });
			
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = enemy.position.x;
			mesh.position.y = enemy.position.y;
			mesh.position.z = 0.1;
			enemy.mesh = mesh;
			scene.add(enemy.mesh);
		})
		
	},
	// 判断某一点是否有怪物活动
	outEnemy(position) {
		return this.enemies.filter(function(enemy) { return enemy.targetPosition.x === position.x && enemy.targetPosition.y === position.y }).length===0
	}
}

var uiController = {
	dom: document.createElement('div'),
	init() {
		this.dom.style.position = 'absolute';
		this.dom.style.top = 0;
		this.dom.style.right = 0;
		this.dom.style.padding = '10px';
		this.dom.style.backgroundColor = 'rgba(255,255,255,0.3)';
		this.dom.style.color = 'rgb(255,255,255)';
		document.body.appendChild(this.dom);
	},
	update() {
		this.dom.innerText = [
			'敌人数量:'+ enemyController.enemies.length+'个',
			'圈地数量:'+ playerController.blocks.length+'格',
		].join('\n');
	}
}


init();
animate();

function pathGeometry(path) {
	var geometry = new THREE.BufferGeometry();
	var position = [];

	path.forEach(function(item, index) {
		position = position.concat([item.x, item.y, item.z])
		if(index!==0 && index!==(path.length-1)) {
			position = position.concat([item.x, item.y, item.z])
		}
	})
	
	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
	return geometry;
}

function init() {

	
	var aspect = window.innerWidth / window.innerHeight;
	var width = 10*aspect, height = 10;

	// camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 100 );
	camera.position.z = 10;

	scene = new THREE.Scene();

	var grid = new THREE.GridHelper( CONST.gridCount, CONST.gridCount, 0xffffff, 0x555555 );
	grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
	scene.add( grid );

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.z = 0.1;
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	uiController.init();
}

function animate() {
	requestAnimationFrame( animate );

	var dir = CONST.direction[player.direction];
	mesh.position.x += dir.x* CONST.palyerV;
	mesh.position.y += dir.y* CONST.palyerV;
	// 根据物体位置，更新控制器坐标
	playerController.update(mesh);
	// 相关计算
	playerController.calculate();
	// 更新绘制
	playerController.applyMesh(mesh);
	playerController.applyCamera(camera);
	playerController.drawPath();
	playerController.drawArea()

	// 计算怪物位置
	enemyController.calculate();
	enemyController.drawEnemies();

	// 更新ui
	uiController.update();
	// 碰撞检测

	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}