import player from '../../scripts/models/player'
import CONST from '../../scripts/consts/index'

import DebugUIController from '../../scripts/controllers/DebugUIController';
import PlayerController from '../../scripts/controllers/PlayerController';
import EnemyController from '../../scripts/controllers/EnemyController';
import GestureController from '../../scripts/controllers/GestureController';
import WebGLScene from '../webglScene';

export default class PlayScene extends WebGLScene {
    Start() {
        var aspect = window.innerWidth / window.innerHeight;
        var width = 10*aspect, height = 10;
        // 更新相机和相机位置
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 100 );
        this.camera.position.z = 10;
        // 初始化控制器
        this.gestureController = new GestureController(); // 手势控制器
        this.playerController = new PlayerController(this.scene, this.camera, this.gestureController); // 玩家控制器
        this.enemyController = new EnemyController(this.scene, this.camera, this.playerController); // 敌人控制器
        this.uiController = new DebugUIController(this.playerController, this.enemyController,  this.gestureController); // 调试界面显示

        this.playerController.init();
        this.uiController.init();
        this.gestureController.init();
    }
    Update() {
        // 根据物体位置，更新控制器坐标
        this.playerController.update();
        // 相关计算
        this.playerController.calculate();
        // 更新绘制
        this.playerController.applyMesh();
        this.playerController.applyCamera();
        this.playerController.drawPath();
        this.playerController.drawArea()
    
        // 计算怪物位置
        this.enemyController.calculate();
        this.enemyController.drawEnemies();
    
        // 更新ui
        this.uiController.update();
        // 碰撞检测

    }
    End() {
        this.gestureController.unload();
    }
}