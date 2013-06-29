// Variables for x, y, z of each joint
var head_x, head_y, head_z, neck_x, neck_y, neck_z, leftShoulder_x, leftShoulder_y, leftShoulder_z, leftElbow_x, leftElbow_y, leftElbow_z, leftHand_x, leftHand_y, leftHand_z, rightShoulder_x, rightShoulder_y, rightShoulder_z, rightElbow_x, rightElbow_y, rightElbow_z, rightHand_x, rightHand_y, rightHand_z, torso_x, torso_y, torso_z, leftHip_x, leftHip_y, leftHip_z, leftKnee_x, leftKnee_y, leftKnee_z, leftFoot_x, leftFoot_y, leftFoot_z, rightHip_x, rightHip_y, rightHip_z, rightKnee_x, rightKnee_y, rightKnee_z, rightFoot_x, rightFoot_y, rightFoot_z;

// Variables for each joint
var head, neck, leftShoulder, leftElbow, leftHand, rightShoulder, rightElbow, rightHand, torso, leftHip, leftKnee, leftFoot, rightHip, rightKnee, rightFoot;

var socket = io.connect('http://localhost:5000');
socket.on('kinect', function (data) {            

	head_x = data.head.x;
    head_y = data.head.y;
	head_z = data.head.z;

	neck_x = data.neck.x;
  	neck_y = data.neck.y;
  	neck_z = data.neck.z;

  	leftShoulder_x = data.leftShoulder.x;
	leftShoulder_y = data.leftShoulder.y;
	leftShoulder_z = data.leftShoulder.z;

	leftElbow_x = data.leftElbow.x;
	leftElbow_y = data.leftElbow.y;
	leftElbow_z = data.leftElbow.z;

	leftHand_x = data.leftHand.x;
	leftHand_y = data.leftHand.y;
	leftHand_z = data.leftHand.z;

	rightShoulder_x = data.rightShoulder.x;
	rightShoulder_y = data.rightShoulder.y;
	rightShoulder_z = data.rightShoulder.z;

	rightElbow_x = data.rightElbow.x;
	rightElbow_y = data.rightElbow.y;
	rightElbow_z = data.rightElbow.z;

	rightHand_x = data.rightHand.x;
	rightHand_y = data.rightHand.y;
	rightHand_z = data.rightHand.z;

	torso_x = data.torso.x;
  	torso_y = data.torso.y;
  	torso_z = data.torso.z;

  	leftHip_x = data.leftHip.x;
	leftHip_y = data.leftHip.y;
	leftHip_z = data.leftHip.z;

	leftKnee_x = data.leftKnee.x;
	leftKnee_y = data.leftKnee.y;
	leftKnee_z = data.leftKnee.z;

	leftFoot_x = data.leftFoot.x;
	leftFoot_y = data.leftFoot.y;
	leftFoot_z = data.leftFoot.z;

	rightHip_x = data.rightHip.x;
	rightHip_y = data.rightHip.y;
	rightHip_z = data.rightHip.z;

	rightKnee_x = data.rightKnee.x;
	rightKnee_y = data.rightKnee.y;
	rightKnee_z = data.rightKnee.z;

	rightFoot_x = data.rightFoot.x;
	rightFoot_y = data.rightFoot.y;
	rightFoot_z = data.rightFoot.z;

});
	

var stats, scene, renderer;
var camera, cameraControl;

var skeletonLines = new Array();

if( !init() )	animate();

// init the scene
function init(){

	if( Detector.webgl ){
		renderer = new THREE.WebGLRenderer({
			antialias		: true,	// to get smoother output
			preserveDrawingBuffer	: true	// to allow screenshot
		});
	// uncomment if webgl is required
	//}else{
	//	Detector.addGetWebGLMessage();
	//	return true;
	}else{
		renderer	= new THREE.CanvasRenderer();
	}
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('container').appendChild(renderer.domElement);

	// enable shadows and light frustrum wireframes
	renderer.shadowMapEnabled = true;

	// add Stats.js - https://github.com/mrdoob/stats.js
	stats = new Stats();
	stats.domElement.style.position	= 'absolute';
	stats.domElement.style.bottom	= '0px';
	document.body.appendChild( stats.domElement );

	// create a scene
	scene = new THREE.Scene();

	// put a camera in the scene
	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0, 10, 200); // z = 240
	camera.rotation.set(-0.14, 0, 0);
	scene.add(camera);

	var smallBall = 0.1; // small ball for other joints
	var bigBall = 1; // big ball for leftHand, rightHand, leftElbow 

	// Declare each joint as a new joint(function)
	head = new joint(smallBall);
	neck = new joint(smallBall);
	leftShoulder = new joint(smallBall);
	leftElbow = new joint(bigBall);
	leftHand = new joint(bigBall);
	rightShoulder = new joint(smallBall);
	rightElbow = new joint(smallBall);
	rightHand = new joint(bigBall);
	torso = new joint(smallBall);
	leftHip = new joint(smallBall);
	leftKnee = new joint(smallBall);
	leftFoot = new joint(smallBall);
	rightHip = new joint(smallBall);
	rightKnee = new joint(smallBall);
	rightFoot = new joint(smallBall);

	// transparently support window resize
	THREEx.WindowResize.bind(renderer, camera);
	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(renderer);
	// allow 'f' to go fullscreen where this feature is supported
	if( THREEx.FullScreen.available() ){
		THREEx.FullScreen.bindKey();		
		document.getElementById('inlineDoc').innerHTML	+= "- <i>f</i> for fullscreen";
	}
	
	base();	
	lighting();
	grid();

	skeletonLines[0] = new line(head,neck);
	skeletonLines[1] = new line(rightShoulder,leftShoulder);
	skeletonLines[2] = new line(rightShoulder,rightElbow);
	skeletonLines[3] = new line(rightElbow,rightHand);
	skeletonLines[4] = new line(leftShoulder,leftElbow);
	skeletonLines[5] = new line(leftElbow,leftHand);
	skeletonLines[6] = new line(neck,torso);
	skeletonLines[7] = new line(torso,leftHip);
	skeletonLines[8] = new line(torso,rightHip);
	skeletonLines[9] = new line(rightHip,rightKnee);
	skeletonLines[10] = new line(rightKnee,rightFoot);
	skeletonLines[11] = new line(leftHip,leftKnee);
	skeletonLines[12] = new line(leftKnee,leftFoot);

}

// Create the floor base
function base() {

	var baseGeometry = new THREE.PlaneGeometry( 480, 240, 20, 20 );
	var baseMaterial = new THREE.MeshPhongMaterial( { 	
			ambient: 0xFFFFFF, 
			color: 0xFFFFFF,
			shininess: 300,
			specular: 0x33AA33,
			shading: THREE.SmoothShading,
			transparent: true,
			opacity: 0.3,
			wireframe: false,
			recieveShadow: true
		} );
	base = new THREE.Mesh( baseGeometry, baseMaterial );
	base.rotation.x = - Math.PI / 2;
	base.position.y = -50;
	base.position.z = -1;
	base.receiveShadow = true;
	scene.add( base );
}

// Create the grid base
function grid() {

	var gridGeometry = new THREE.PlaneGeometry( 480, 240, 20, 20 );
	var gridMaterial = new THREE.MeshLambertMaterial( { 	
			ambient: 0xFFFFFF, 
			color: 0x000000,
			specular: 0xFFFFFF,
			shading: THREE.SmoothShading,
			transparent: true,
			opacity: 0.05,
			wireframe: true 
		} );
	grid = new THREE.Mesh( gridGeometry, gridMaterial );
	grid.rotation.x = - Math.PI / 2;
	grid.position.y = -49.9;
	grid.position.z = -1;
	scene.add( grid );
}

// scene lighting
function lighting() {

	var pointLight = new THREE.PointLight(0xFFFFFF,1,800); // point light
	pointLight.position.x = 200; // light position
	pointLight.position.y = 50;
	pointLight.position.z = 100;
	scene.add(pointLight); // add light to scene

	/*var spotLight = new THREE.SpotLight(0xFFFFFF,0.35,0);
	spotLight.position.x = 0; // light position
	spotLight.position.y = 80;
	spotLight.position.z = 200;
	spotLight.castShadow = true;
	spotLight.shadowDarkness = 0.5;
	//spotLight.shadowCameraVisible = true; // shows light frustrum wireframe
	scene.add(spotLight);*/
	  
	// directional lighting
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);

}

function joint(jointRadius) {
	var radius = jointRadius;

	var jointGeometry = new THREE.SphereGeometry(radius, 15, 15); // was 2,15,15
	var jointMaterial = new THREE.MeshLambertMaterial( { 
			ambient: 0xFFFFFF, 
			color: 0x0099CC, 
			specular: 0x000000, 
			shading: THREE.SmoothShading, 
			opacity: 1.0, 
			transparent: false, 
			castShadow: true,
			receiveShadow: true
		} );
    this.joint = new THREE.Mesh(jointGeometry, jointMaterial); // create new mesh - sphere geometry
	scene.add(this.joint); // add joint sphere to scene

}

function updateJoint() {

	head.joint.position.x = head_x/20;
	head.joint.position.y = (head_y/20)+5;
	head.joint.position.z = (head_z/-20)+100;

	neck.joint.position.x = neck_x/20;
	neck.joint.position.y = (neck_y/20)+5;
	neck.joint.position.z = (neck_z/-20)+100;

	leftShoulder.joint.position.x = leftShoulder_x/20;
	leftShoulder.joint.position.y = (leftShoulder_y/20)+5;
	leftShoulder.joint.position.z = (leftShoulder_z/-20)+100;

	leftElbow.joint.position.x = leftElbow_x/20;
	leftElbow.joint.position.y = (leftElbow_y/20)+5;
	leftElbow.joint.position.z = (leftElbow_z/-20)+100;

	leftHand.joint.position.x = leftHand_x/20;
	leftHand.joint.position.y = (leftHand_y/20)+5;
	leftHand.joint.position.z = (leftHand_z/-20)+100;

	rightShoulder.joint.position.x = rightShoulder_x/20;
	rightShoulder.joint.position.y = (rightShoulder_y/20)+5;
	rightShoulder.joint.position.z = (rightShoulder_z/-20)+100;

	rightElbow.joint.position.x = rightElbow_x/20;
	rightElbow.joint.position.y = (rightElbow_y/20)+5;
	rightElbow.joint.position.z = (rightElbow_z/-20)+100;

	rightHand.joint.position.x = rightHand_x/20;
	rightHand.joint.position.y = (rightHand_y/20)+5;
	rightHand.joint.position.z = (rightHand_z/-20)+100;

	torso.joint.position.x = torso_x/20;
	torso.joint.position.y = (torso_y/20)+5;
	torso.joint.position.z = (torso_z/-20)+100;

	leftHip.joint.position.x = leftHip_x/20;
	leftHip.joint.position.y = (leftHip_y/20)+5;
	leftHip.joint.position.z = (leftHip_z/-20)+100;

	leftKnee.joint.position.x = leftKnee_x/20;
	leftKnee.joint.position.y = (leftKnee_y/20)+5;
	leftKnee.joint.position.z = (leftKnee_z/-20)+100;

	leftFoot.joint.position.x = leftFoot_x/20;
	leftFoot.joint.position.y = (leftFoot_y/20)+5;
	leftFoot.joint.position.z = (leftFoot_z/-20)+100;

	rightHip.joint.position.x = rightHip_x/20;
	rightHip.joint.position.y = (rightHip_y/20)+5;
	rightHip.joint.position.z = (rightHip_z/-20)+100;

	rightKnee.joint.position.x = rightKnee_x/20;
	rightKnee.joint.position.y = (rightKnee_y/20)+5;
	rightKnee.joint.position.z = (rightKnee_z/-20)+100;

	rightFoot.joint.position.x = rightFoot_x/20;
	rightFoot.joint.position.y = (rightFoot_y/20)+5;
	rightFoot.joint.position.z = (rightFoot_z/-20)+100;

}

function point(RHx,RHy,RHz) {

	var pointGeometry = new THREE.SphereGeometry(1, 15, 15);
	var pointMaterial = new THREE.MeshLambertMaterial( { 
			ambient: 0xFFFFFF, 
			color: 0xCC0099,
			specular: 0x000000, 
			shading: THREE.SmoothShading,
			transparent: true,
			opacity: 0.8 
		} );
    this.point = new THREE.Mesh(pointGeometry, pointMaterial); // create new mesh - sphere geometry

    this.point.position.x = RHx;
    this.point.position.y = RHy;
    this.point.position.z = RHz;

    this.point.geometry.dynamic = true;
    this.point.geometry.verticesNeedUpdate = true;

	scene.add(this.point); // add point sphere to scene

}

function triPlane(pointA,pointB,pointC) {

	var verticeA = new THREE.Vector3(pointA.point.position.x, pointA.point.position.y, pointA.point.position.z);
	var verticeB = new THREE.Vector3(pointB.point.position.x, pointB.point.position.y, pointB.point.position.z);
	var verticeC = new THREE.Vector3(pointC.point.position.x, pointC.point.position.y, pointC.point.position.z);

	var triPlaneGeometry = new THREE.Geometry();

	triPlaneGeometry.vertices.push(verticeA);
	triPlaneGeometry.vertices.push(verticeB);
	triPlaneGeometry.vertices.push(verticeC);

	triPlaneGeometry.faces.push(new THREE.Face3(0,1,2));

	var triPlaneMaterial = new THREE.MeshLambertMaterial({
		color: 0x660099, 
		wireframe: false,
		wireframeLinewidth: 3,
		shading: THREE.SmoothShading, 
		transparent: true,
		opacity: 0.6,
		castShadow: true,
		recieveShadow: true
	});

	triPlaneMaterial.side = THREE.DoubleSide; // make triPlane doublesided

    this.triPlane = new THREE.Mesh(triPlaneGeometry, triPlaneMaterial); // create new mesh - sphere geometry
    this.triPlane.geometry.dynamic = true;

    this.triPlane.geometry.computeFaceNormals();

	scene.add(this.triPlane); // add triPlane (triangle) to scene

}

var testBoolean = false; // Used to test whether left hand y < left hand x
var triangleCounter = 0; 
var triangleArray = new Array(); // Array of triangles placed
var pointArray = new Array(); // Array of points placed
var counter = -1;

// add a point
function addPoint() {
	
	if ( leftHand.joint.position.y < leftElbow.joint.position.y && testBoolean == false ) // if left hand goes below left elbow
	{
		counter++;

		testBoolean = true;
		var RHx = rightHand.joint.position.x;
		var RHy = rightHand.joint.position.y;
		var RHz = rightHand.joint.position.z;
		
		console.log(counter);
		if(counter%3 == 0){
			pointArray[counter] = new point(RHx,RHy,RHz);
		}
		if(counter%3 == 1){
			pointArray[counter] = new point(RHx,RHy,RHz);
			pointArray[counter+1] = new point(RHx,RHy,RHz);
		}
		if(counter%3 == 2){

		}

		if (Math.floor(pointArray.length/3) > triangleCounter){
			
			// make a triangle
			var pointA = pointArray[(triangleCounter*3)];
			var pointB = pointArray[(triangleCounter*3)+1];
			var pointC = pointArray[(triangleCounter*3)+2];

			triangleArray[triangleCounter] = new triPlane(pointA,pointB,pointC);
			triangleCounter++;

		}

	}
	
	if ( leftHand.joint.position.y > leftElbow.joint.position.y && testBoolean == true )
	{
		testBoolean = false;
	}
		
}

function line(sphereA, sphereB){ // draw lines between joints for skeleton

	this.sphereA = sphereA;
	this.sphereB = sphereB;

	var pointA = new THREE.Vector3( sphereA.joint.position.x, sphereA.joint.position.y, sphereA.joint.position.z );
    var pointB = new THREE.Vector3( sphereB.joint.position.x, sphereB.joint.position.y, sphereB.joint.position.z );

    var lineGeometry = new THREE.Geometry();

    lineGeometry.vertices.push( pointA ); 
    lineGeometry.vertices.push( pointB );
    lineGeometry.verticesNeedUpdate = true;

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF, transparent: true, linewidth: 3 } );

    this.line = new THREE.Line( lineGeometry, lineMaterial );
    this.line.geometry.verticesNeedUpdate = true;

	scene.add( this.line );

}

function updateRelationshipVertices(){ // update lines when user moves
	
	for(var i = 0; i<skeletonLines.length; i++){

		var sphereAPos = skeletonLines[i].sphereA.joint.position;
		var sphereBPos = skeletonLines[i].sphereB.joint.position;
		
		skeletonLines[i].line.geometry.vertices[0].set(sphereAPos.x,sphereAPos.y,sphereAPos.z);
		skeletonLines[i].line.geometry.vertices[1].set(sphereBPos.x,sphereBPos.y,sphereBPos.z);
		skeletonLines[i].line.geometry.verticesNeedUpdate = true;
	}
	
}

// animation loop
function animate() {

	// loop on request animation loop - IMPORTANT - at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame( animate );

	updateJoint();

	updateRelationshipVertices();

	addPoint();
	
	if(counter > 0 && counter == (triangleCounter*3)-2){
		
		triangleArray[triangleCounter-1].triPlane.geometry.verticesNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.vertices[2].set(rightHand.joint.position.x, rightHand.joint.position.y, rightHand.joint.position.z);

		pointArray[counter].point.position.x = rightHand.joint.position.x;
		pointArray[counter].point.position.y = rightHand.joint.position.y;
		pointArray[counter].point.position.z = rightHand.joint.position.z;

		triangleArray[triangleCounter-1].triPlane.geometry.verticesNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.elementsNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.morphTargetsNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.uvsNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.normalsNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.colorsNeedUpdate = true;
		triangleArray[triangleCounter-1].triPlane.geometry.tangentsNeedUpdate = true;

		//triangleArray[triangleCounter-1].triPlane.geometry.computeVertexNormals();
		triangleArray[triangleCounter-1].triPlane.geometry.computeFaceNormals();

	}

	// do the render
	render();
	
	// update stats
	stats.update();
}

// render the scene
function render() {

	// actually render the scene
	renderer.render( scene, camera );

}