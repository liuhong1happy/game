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

var player = {
	direction: 'w',
	position: {
		x: 0,
		y: 0
	},
	hasFirstArea: false,
}

var controller = {
	direction: 's',
	position: {
		x: 0,
		y: 0
	},
	path: [{x:0,y:0,z:0.01}],
	area: [],
	calculate() {
		var sameDir = player.direction === this.direction;
		var distance = Math.sqrt(Math.pow(player.position.x - this.position.x, 2) + Math.pow(player.position.y - this.position.y, 2))
		if(distance>=1) {
			player.position = { x: Math.round(this.position.x), y: Math.round(this.position.y) }
			if(!sameDir) {
				player.direction = this.direction;
				this.position = { x: player.position.x, y: player.position.y };
			}

			var findIndex = this.path.findIndex(function(item) {
				return item.x === player.position.x && item.y === player.position.y;
			})

			if(findIndex!==-1) {
				this.path.splice(findIndex+1, this.path.length - findIndex);
			} else {
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
		var dir = ['w', 's', 'a', 'd'][parseInt(Math.random()*4)%4];
		controller.direction = dir;
	},
	apply(obj) {
		obj.position.x = this.position.x;
		obj.position.y = this.position.y;
	},
	update(obj) {
		this.position.x = obj.position.x;
		this.position.y = obj.position.y;
	},
	applyPath() {
		if(this.path.length>1) {
			if(!pathMesh) {
				pathMesh = new THREE.LineSegments( pathGeometry(this.path), new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 0.3, gapSize: 0.1, linewidth: 2 } ) );
				pathMesh.computeLineDistances();
				scene.add(pathMesh);
			} else {
				pathMesh.geometry = pathGeometry(this.path);
				pathMesh.computeLineDistances();
			}
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

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 10;

	scene = new THREE.Scene();

	var grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
	grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
	scene.add( grid );

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );


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

	// 测试，随机控制方向
	controller.random();
	// 相关计算
	controller.calculate();

	// 更新绘制
	controller.apply(camera);
	controller.apply(mesh);
	controller.applyPath(pathMesh, scene);

	// 计算怪物位置

	// 碰撞检测

	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}