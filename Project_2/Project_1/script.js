let mouseX = 0;
let mouseY = 0;
let halfWidth = window.innerWidth / 2;
let halfHeight = window.innerHeight / 2;

let renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('canvas'),
	antialias: true
});

renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2000);

camera.position.z = 0;

let scene = new THREE.Scene();

let ambLight = new THREE.AmbientLight(0xffffff, 0.2);
let pointLight = new THREE.PointLight(0x00ffff, 0.9, 1000, 2);

pointLight.position.set(0, 200, -500);

scene.add(ambLight);
scene.add(pointLight);

function setProps(mesh) {
	mesh.vx = random(-.2, .2);
	mesh.vy = random(-.2, .2);
	mesh.vz = random(1, 4);
	mesh.vs = random(.001, .006)
	mesh.vrx = random(-.05, .05);
	mesh.vry = random(-.05, .05);
	mesh.scale.x = .1;
	mesh.scale.y = .1;
	mesh.scale.z = .1;
	mesh.position.set(random(-400, 400), random(-400, 400), random(-600, -800));
}

let material = new THREE.MeshStandardMaterial({
	color: 0x00ffff,
	roughness: .6,
	metalness: .5
});

let group = new THREE.Group();

for (let i = 0; i < 1000; i++) {
	let size = random(2, 10);
	let geometry = new THREE.BoxGeometry(size, size, size);
	let mesh = new THREE.Mesh(geometry, material);
	setProps(mesh);
	setTimeout(function() {
		group.add(mesh);
	}, i * 20);
}

scene.add(group);

function random(min, max) {
	return Math.random() * (max - min) + min;
}

function touches(e) {
	let x = e.touches ? e.touches[0].clientX : e.clientX;
	let y = e.touches ? e.touches[0].clientY : e.clientY;
	mouseX = (x - halfWidth) * .4;
	mouseY = (y - halfHeight) * .4;
}

function animate() {
	camera.position.x += (mouseX - camera.position.x) * .03;
	camera.position.y += (mouseY - camera.position.y) * .03;
	camera.lookAt(mouseX, mouseY);

	group.children.forEach((mesh) => {
		if (mesh.position.z < 0) {
			mesh.rotation.x += mesh.vrx;
			mesh.rotation.y += mesh.vry;
			mesh.position.z += mesh.vz;
			mesh.position.x += mesh.vx;
			mesh.position.y += mesh.vy;
			mesh.scale.x += mesh.vs;
			mesh.scale.y += mesh.vs;
			mesh.scale.z += mesh.vs;
		} else {
			setProps(mesh);
		}
	});

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	let halfWidth = window.innerWidth / 2;
	let halfHeight = window.innerHeight / 2;
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", touches);
window.addEventListener("touchmove", touches);
document.addEventListener("mouseleave", () => {
	mouseX = 0;
	mouseY = 0;
});