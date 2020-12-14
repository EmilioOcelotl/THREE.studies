import * as THREE from "./three/build/three.module.js";

export const Scene = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true }),
    init: function() {
	this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector("#scene").appendChild(this.renderer.domElement);
	// Aqui van las cosas ;
        this.animate();

    },
    animate: function() {
        window.requestAnimationFrame(Scene.animate);
        Scene.renderer.render(Scene.scene, Scene.camera);
    }
};
window.addEventListener('resize', function onWindowResize() {
    Scene.camera.aspect = window.innerWidth / window.innerHeight;
    Scene.camera.updateProjectionMatrix();
    Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
document.querySelectorAll(".quality").forEach(function (qual_item) {
    qual_item.addEventListener("click", function (event) {
        let selection = event.target;
        let quality = parseFloat(selection.getAttribute("quality"));
        document.querySelectorAll(".quality").forEach(function (qual) {
            qual.classList.remove("active");
        });
        selection.classList.add("active");
        Scene.renderer.setPixelRatio(quality);
    });
});
window.Scene = Scene;
window.THREE = THREE;
