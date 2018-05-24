import Scene from '../../core/scenes/scene'
import _history from '../../core/route/history'
import CImage from '../../core/ui/CImage';
import CText from '../../core/ui/CText';

export default class HomeScene extends Scene {
    Start() {
        this.context.fillStyle = "white"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        // 背景图片
        this.bgImage = new CImage('../../../src/assets/images/qt/zy_bg.jpg'); 
        this.bgImage.setPosition(0, 0);
        this.bgImage.setSize(window.innerWidth, window.innerHeight);
        this.children.push(this.bgImage)
        // logo
        var logoWidth = window.innerWidth * 0.68;
        var logoHeight = logoWidth / 445 * 199;
        this.logoImage = new CImage('../../../src/assets/images/qt/logo.png'); 
        this.logoImage.setPosition((window.innerWidth - logoWidth)/2, logoHeight*0.68);
        this.logoImage.setSize(logoWidth, logoHeight);
        this.children.push(this.logoImage)

        // 排行榜图片
        this.phbImage = new CImage('../../../src/assets/images/qt/phb.png'); 
        this.phbImage.setPosition(20, window.innerHeight - 50);
        this.phbImage.setSize(47, 30);
        this.children.push(this.phbImage)
        // 排行榜
        this.phbText = new CText('排行榜')
        this.phbText.fontSize = 15;
        this.phbText.setPosition(20, window.innerHeight - 30);
        this.phbText.setSize(47, 30);
        this.phbText.textAlign = 'center';
        this.phbText.textAlignVertical = 'center';
        this.phbText.color = 'white';
        this.children.push(this.phbText)

        // 排行榜图片
        var hosanWidth = 105
        var hosanHeight = 36;
        this.hosanImage = new CImage('../../../src/assets/images/qt/hosan.png'); 
        this.hosanImage.setPosition(window.innerWidth / 2 - hosanWidth /2, window.innerHeight - 140);
        this.hosanImage.setSize(hosanWidth, hosanHeight);
        this.children.push(this.hosanImage)

        // 排行榜图片
        var ksyxWidth = 79
        var ksyxHeight = 20;
        this.ksyxImage = new CImage('../../../src/assets/images/qt/ksyx.png'); 
        this.ksyxImage.setPosition(window.innerWidth / 2 - ksyxWidth /2, window.innerHeight - 140 + (hosanHeight-ksyxHeight)/2);
        this.ksyxImage.setSize(ksyxWidth, ksyxHeight);
        this.children.push(this.ksyxImage)
    }
    Update() {
        // this.context.fillStyle = "white"
        // this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
    }
    End() {
        
    }
}