export default class Hero {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.clock = new THREE.Clock;
        this.mesh = null;
        this.meshes = new THREE.Group();
        this.mixer = null;
        this.paused = true;
        this.scale = 0.005;
        this.meshes.scale.set(this.scale, this.scale, this.scale)
        this.meshes.rotateX(THREE.Math.degToRad(90));
        this.meshes.rotateY(THREE.Math.degToRad(180));
        this.scene.add(this.meshes)
    }

    static mixers = [];

    createMaterials(data)
    {
        var matArray = [];
        for (var j = 0; j < data.materials.length; ++j)
        {
            var mat = new THREE.MeshPhongMaterial({});
            mat.copy(data.materials[j]);
            //mat.transparent = true;
            matArray.push(mat);
        }
        return matArray;
    }

    preload(url) {
        if(this.loaded) return;
        this.loaded = true;
        var loader = new THREE.JDLoader();
        loader.load(url, (data) => {                            
            for (var i = 0; i < data.objects.length; ++i)
            {
                if (data.objects[i].type == "Mesh" || data.objects[i].type == "SkinnedMesh")
                {
                    var mesh = null;
                    var matArray = this.createMaterials(data);
                    if (data.objects[i].type == "SkinnedMesh")
                    {
                        mesh = new THREE.SkinnedMesh(data.objects[i].geometry, matArray);
                    }
                    else // Mesh
                    {
                        mesh = new THREE.Mesh(data.objects[i].geometry, matArray);
                    }
                    this.meshes.add(mesh);
                    if (mesh && mesh.geometry.animations)
                    {
                        this.mesh = mesh;
                        this.mixer = new THREE.AnimationMixer(this.mesh);
                        Hero.mixers.push(this.mixer);
                        var action = this.mixer.clipAction(this.mesh.geometry.animations[1] );
                        action.play();
                    }
                }
            }

            if(this.position) {
                // this.meshes.position.set(this.position);
            }
        });
    }

    born(position) {
        this.position = position;
        if (this.mesh) {
            this.mesh.position.set(this.position);
        }
    }

    update(direction) {
        
        var delta = this.clock.getDelta();
        if(this.paused && this.mixer) this.mixer.update(delta);
        if(this.direction !== direction && this.mesh) {
            switch (direction) {
                case 'w':
                    this.meshes.rotation.set(Math.PI/2, Math.PI, 0, 'XYZ')
                    break;
                case 's':
                    this.meshes.rotation.set(Math.PI/2, 0, 0, 'XYZ')
                    break;
                case 'a':
                    this.meshes.rotation.set(Math.PI/2, -Math.PI/2, 0, 'XYZ')
                    break;
                case 'd':
                    this.meshes.rotation.set(Math.PI/2, Math.PI/2, 0, 'XYZ')
                    break;
                default:
                    break;
            }
        }
        this.direction = direction;
    }

    play(animationName) {
        if (this.mesh && this.mesh.geometry.animations)
        {
            var clips = this.mesh.geometry.animations;
            var clip = THREE.AnimationClip.findByName( clips, animationName );
            var action = this.mixer.clipAction( clip );
            action.play();
        }
        this.paused = false;
    }

    stop(animationName) {
        this.paused = true;
    }
}