import * as THREE from 'three'
import player from '../models/player'
import CONST from '../consts'


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

// 计算玩家位置、方向、区域等
export default class PlayerController {    
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    direction = 's';
	position = {
		x: 0,
		y: 0
	};
    path = [{x:0,y:0,z:0.01}];
    // 所有围成的区域
	areas = [];
    blocks = [];
    init() {
        // 初始化网格
        var grid = new THREE.GridHelper( CONST.gridCount, CONST.gridCount, 0xffffff, 0x555555 );
        grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
        this.scene.add( grid );
        // 初始化玩家mesh
        var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.position.z = 0.1;
        this.scene.add(this.mesh);
    }
	addBlocks(blocks) {
		var canInsertBlocks = [];
		this.blocks.forEach(function(oldBlock) {
			var index = blocks.findIndex(function(newBlock) { return newBlock.point1.x === oldBlock.point1.x && newBlock.point1.y === oldBlock.point1.y });
			if(index!==-1) blocks.splice(index, 1);
		})
		this.blocks = this.blocks.concat(blocks);
		console.log('this.blocks', this.blocks);
	}
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
		for(var x=minX;x<=maxX;x++) {
			var intCount = -1;
			for(var y=maxY;y>minY;y--) {
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
	}
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
			this.scene.add(area.mesh);
		})
	}
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
	}
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
	}
	applyMesh() {
		this.mesh.position.x = this.position.x;
		this.mesh.position.y = this.position.y;
	}
	applyCamera() {
		this.camera.position.x = this.position.x-10;
		this.camera.position.y = this.position.y-10;
		this.camera.position.z = 10*Math.sqrt(3)/2;
		this.camera.up = new THREE.Vector3(0.5, 0.5, 0)
		this.camera.lookAt( this.position.x, this.position.y, 0 );
	}
	update() {
        var dir = CONST.direction[player.direction];
        this.mesh.position.x += dir.x* CONST.palyerV;
        this.mesh.position.y += dir.y* CONST.palyerV;
		this.position.x = this.mesh.position.x;
		this.position.y = this.mesh.position.y;
	}
	drawPath() {
		if(this.path.length>1) {
			if(!this.pathMesh) {
				this.pathMesh = new THREE.LineSegments( pathGeometry(this.path), new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 0.3, gapSize: 0.1, linewidth: 2 } ) );
				this.pathMesh.computeLineDistances();
				this.scene.add(this.pathMesh);
			} else {
				this.pathMesh.geometry = pathGeometry(this.path);
				this.pathMesh.computeLineDistances();
			}
			this.pathMesh.visible = true;
		} else {
			if(this.pathMesh) this.pathMesh.visible = false;
		}
	}
	// 判断某一点是否可以生成怪物
	outBlock(position) {
		return this.blocks.filter(function(block) {
			return (block.point1.x === position.x && block.point1.y === position.y) || (block.point3.x === position.x && block.point3.y === position.y)
		}).length === 0;
	}
	// 计算位置到玩家的距离
	distance(position) {
		return Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2))
	}
	outPath(position) {
		return this.path.filter(function(point) {
			return (point.x === position.x && point.y === position.y)
		}).length === 0;
	}
}