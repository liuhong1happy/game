export default class GridPlane {
    constructor( size, divisions, material1, material2 ) {
        this.size = size || 10;
        this.divisions = divisions || 10;
        this.material1 = material1;
        this.material2 = material2;

        this.center = this.divisions / 2;
        this.step = this.size / this.divisions;
        this.halfSize = this.size / 2;

        this.vertices = []
        this.faces = [];
        this.materials = [this.material1, this.material2];
        this.faceVertexUvs = [[]]

        for(var x= -this.halfSize;x<this.halfSize-1;x++) {
            for(var y=-this.halfSize;y<this.halfSize-1;y++) {
                var positions = [
                    new THREE.Vector3(x, 0, y),
                    new THREE.Vector3(x+1, 0, y),
                    new THREE.Vector3(x+1, 0, y+1),
                    new THREE.Vector3(x, 0, y+1),
                ]
                var start = this.vertices.length;
                var startFaceIndex = this.faces.length;
                var faces = [
                    new THREE.Face3( start+0, start+1, start+2 ),
                    new THREE.Face3( start+0, start+2, start+3 )
                ]
                faces.forEach(face=>{
                    face.normal = new THREE.Vector3(0,0,1);
                    face.vertexNormals = [new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,1)]
                })

                this.faces.push(...faces);
                this.faceVertexUvs[0][startFaceIndex+0] = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]
                this.faceVertexUvs[0][startFaceIndex+1] = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]
                this.vertices.push(...positions);
            }
        }
        this.geometry = new THREE.Geometry();
        this.geometry.vertices = this.vertices;
        this.geometry.faces = this.faces;
        this.geometry.faceVertexUvs = this.faceVertexUvs;
        this.mesh = new THREE.Mesh(this.geometry, this.materials);
    }

    updateFaceIndex(blocks) {
        var blocksHelper = {}
        blocks.map(({x, y})=>{
            blocksHelper["positions:"+x+'_'+(-y)] = 1;
        })

        this.faces = [];
        for(var x= -this.halfSize;x<this.halfSize-1;x++) {
            for(var y=-this.halfSize;y<this.halfSize-1;y++) {
                var start = this.faces.length*2;
                var faces = [
                    new THREE.Face3( start+0, start+1, start+2 ),
                    new THREE.Face3( start+0, start+2, start+3 )
                ]
                faces.forEach(face=>{
                    face.normal = new THREE.Vector3(0,0,1);
                    face.vertexNormals = [new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,1)]
                    if(blocksHelper["positions:"+x+'_'+y]) face.materialIndex = 1;
                })
                this.faces.push(...faces);
            }
        }
        this.geometry.faces = this.faces;
        this.geometry.elementsNeedUpdate = true;
    }
}