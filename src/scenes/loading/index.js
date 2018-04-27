import Scene from '../scene'
import _history from '../history'

export default class LoadingScene extends Scene {
    Start() {
        this.precent = 0;
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
    }
    Update() {
        this.precent += Math.random()*0.4;
        if(this.precent>= 100) {
            this.precent = 100;
            _history.push('/play', {})
        }
        this.context.clearRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "white"
        this.context.font ="30px Times New Roman";      
        var text = this.precent.toFixed(0) + "%";
        var size = this.context.measureText(text)
        this.context.fillText(text, window.innerWidth / 2 - size.width / 2, window.innerHeight/2);   
    }
    End() {
        
    }
}