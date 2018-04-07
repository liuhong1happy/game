var camera, scene, renderer;
var geometry, material, mesh, pathMesh, areaMesh;

var CONST = {
	direction : {
		w: { x: 0, y: 1 },
		s: { x: 0, y: -1 },
		a: { x: 1, y: 0 },
		d: { x: -1, y: 0 }
	}
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
var controller = {
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

	var grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
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
}

function animate() {
	requestAnimationFrame( animate );

	var dir = CONST.direction[player.direction];
	mesh.position.x += dir.x*0.007;
	mesh.position.y += dir.y*0.007;
	// 根据物体位置，更新控制器坐标
	controller.update(mesh);
	// 相关计算
	controller.calculate();
	// 更新绘制
	controller.applyMesh(mesh);
	controller.applyCamera(camera);
	controller.drawPath();
	controller.drawArea()

	// 计算怪物位置

	// 碰撞检测

	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}