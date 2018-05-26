import WebGLScene from '../../core/scenes/webglScene'
import _history from '../../core/route/history'

import player from '../../scripts/models/player'
import CONST from '../../scripts/consts/index'

import DebugUIController from '../../scripts/controllers/DebugUIController';
import PlayerController from '../../scripts/controllers/PlayerController';
import EnemyController from '../../scripts/controllers/EnemyController';
import GestureController from '../../scripts/controllers/GestureController';
import CText from '../../core/ui/CText';
import CLayout from '../../core/ui/CLayout';
import CImage from '../../core/ui/CImage';
import CToggleButton from '../../core/ui/CToggleButton';

export default class PlayScene extends WebGLScene {
    Start() {
        this.Init3D()
        this.Init2D()
    }
    Update() {
        if(this.gameOver) return;
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
        // this.uiController.update();
        // 碰撞检测
        if(this.enemyController.detection()) {
            // Game Over
            alert('Game Over')
            this.gameOver = true;
            _history.reset('/home')
            return;
        }
        if(this.playerController.detection()) {
            // Game Over
            this.gameOver = true;
            _history.reset('/home')
            return;
        }
    }
    End() {
        this.gestureController.unload();
    }


    Init3D() {
        var aspect = window.innerWidth / window.innerHeight;
        var width = 10*aspect, height = 10;
        // 更新相机和相机位置
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 100 );
        this.camera.position.z = 10;
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));
        
        // 初始化控制器
        this.gestureController = new GestureController(); // 手势控制器
        this.playerController = new PlayerController(this.scene, this.camera, this.gestureController); // 玩家控制器
        this.enemyController = new EnemyController(this.scene, this.camera, this.playerController); // 敌人控制器
        // this.uiController = new DebugUIController(this.playerController, this.enemyController,  this.gestureController); // 调试界面显示

        this.playerController.init();
        this.enemyController.init();
        // this.uiController.init();
        this.gestureController.init();
        this.gameOver = false;
    }

    Init2D() {
        // 游戏遮罩
        this.bgImage = new CImage('../../../src/assets/images/qt/yxzz.png'); 
        this.bgImage.setPosition(0, 0);
        this.bgImage.setSize(window.innerWidth, window.innerHeight);
        this.children.push(this.bgImage)

        // 分数
        this.scoreText = new CText('9999')
        this.scoreText.fontSize = 15;
        this.scoreText.fontFamily = 'NUMBER'
        this.scoreText.setSize(window.innerWidth/2 - 60, 30);
        this.scoreText.textAlign = 'left';
        this.scoreText.textAlignVertical = 'center';
        this.scoreText.color = 'white';

        this.scoreLabel = new CText('分数:')
        this.scoreLabel.fontSize = 15;
        this.scoreLabel.fontFamily = 'NUMBER'
        this.scoreLabel.setSize(40, 30);
        this.scoreLabel.textAlign = 'right';
        this.scoreLabel.textAlignVertical = 'center';
        this.scoreLabel.color = 'white';

        this.scoreLayout = new CLayout();
        this.scoreLayout.setSize(window.innerWidth/2, 30);
        this.scoreLayout.gutter = { h: 5, v: 0}
        this.scoreLayout.children.push(this.scoreLabel)
        this.scoreLayout.children.push(this.scoreText)

        this.children.push(this.scoreLayout)


        // 暂停和开始
        this.ksImage = new CImage('../../../src/assets/images/qt/ks.png'); 
        this.ksImage.setSize(23, 26.5);

        this.ztImage = new CImage('../../../src/assets/images/qt/zt.png'); 
        this.ztImage.setSize(23, 26.5);
        
        this.ksLayout = new CLayout();
        this.ksLayout.setPosition(window.innerWidth - 40, 0)
        this.ksLayout.setSize(40, 30)

        this.ksLayout.children.push(this.ksImage)

        this.toggleButton = new CToggleButton();
        this.toggleButton.setPosition(window.innerWidth - 40, 0)
        this.toggleButton.setSize(40, 30)
        this.toggleButton.background = this.ksLayout;
        this.toggleButton.setToggle(true);
        this.toggleButton.addEventListener('change', (toggle)=>{
            if(toggle) {
                this.ksLayout.children[0] = this.ksImage;
            } else {
                this.ksLayout.children[0] = this.ztImage;
            }
        })
        this.children.push(this.toggleButton)
    }
}