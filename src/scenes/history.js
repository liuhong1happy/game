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
            // 卸载当前场景
            // this.current.scene.Unload(); 
            // 初始化新的场景
            scene.Init(this.current.scene.canvas);
            // 保存新的场景
            this.current = {
                path,
                params,
                scene,
            }
            this.current.scene.params = this.current.params;
            // 将新的场景放入历史堆栈中
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
            // 卸载当前场景
            this.current.scene.Unload(); 
            // 初始化新的场景
            scene.Init(this.current.scene.canvas);
            // 保存新的场景
            this.current = {
                path,
                params,
                scene,
            }
            this.current.scene.params = this.current.params;
            // 将新的场景放入历史堆栈中
            this.history = [this.current];
            return this.current;
        } else {
            return false;
        }
    },
    pop() {
        if(this.history.length>=1) {
            // 卸载当前场景
            this.current.scene.Unload(); 
            // 回退到上一级
            return this.history.pop()
        } else {
            return false;
        }
    },
    getCurrent() {
        return this.current;
    }
}