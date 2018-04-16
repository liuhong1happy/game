import Scene from "./scene";

export default {
    current: { path: '/404', params: {}, scene: new Scene() },
    scenes: [],
    history: [],
    init(){
        this.current.scene.canvas =  window.canvas ? window.canvas : document.createElement('canvas');
    },
    addRoute(path, scene) {
        this.scenes.push({
            path,
            scene
        })
    },
    removeRoute(path) {
        var findIndex = this.scenes.findIndex(scene=> scene.path === path );
        if(findIndex !== -1) {
            this.scenes.splice(findIndex, 1)
        } else {
            return false;
        }
    },
    push(path, params) {
        var findIndex = this.scenes.findIndex(scene=> scene.path === path );
        if(findIndex !== -1) {
            let scene = this.scenes[findIndex].scene;
            scene.Init(this.current.scene.canvas);
            this.current = {
                path,
                params,
                scene,
            }
            this.current.scene.params = this.current.params;
            this.history.push(this.current);
            return this.current;
        } else {
            return false;
        }
    },
    reset(path, params) {
        var findIndex = this.scenes.findIndex(scene=> scene.path === path );
        if(findIndex !== -1) {
            let scene = this.scenes[findIndex].scene;
            scene.Init(this.current.scene.canvas);
            this.current = {
                path,
                params,
                scene,
            }
            this.current.scene.params = this.current.params;
            this.history = [this.current];
            return this.current;
        } else {
            return false;
        }
    },
    pop() {
        if(this.history.length>=1) {
            return this.history.pop()
        } else {
            return false;
        }
    },
    getCurrent() {
        return this.current;
    }
}