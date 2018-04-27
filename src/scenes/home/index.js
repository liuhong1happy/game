import Scene from '../scene'

export default class HomeScene extends Scene {
    Start() {
        this.context.clearRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "white"
        this.context.font ="30px Times New Roman";    
        var text = '这是首页';
        var size = this.context.measureText(text)
        this.context.fillText(text, window.innerWidth / 2 - size.width / 2, window.innerHeight/2); 
    }
    Update() {
        this.context.clearRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "white"
        this.context.font ="30px Times New Roman";    
        var text = '这是首页';
        var size = this.context.measureText(text)
        this.context.fillText(text, window.innerWidth / 2 - size.width / 2, window.innerHeight/2); 
    }
    End() {
        
    }
}