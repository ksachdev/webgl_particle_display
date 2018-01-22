(function() {
    //// Rendering related part ////
    var scene, camera, renderer, camera_controller, container, controls, ch;
    var url = 'data/evt1.txt';

    var xymin  = -195;
    var xymax = 195;
    var measure = xymax;
    var zmax  =  1587;
    

    
    // Basic setp
    function init() {
	// Create the scene 
	scene = new THREE.Scene();
	
	// Create the renderer
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight*0.84;	  
	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor(new THREE.Color(0x000000));
	// Put in the DOM
	document.body.appendChild(renderer.domElement);

	// create the camera
	camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 4000);
	camera.position.set(zmax/(2*measure),0,7);
	scene.add(camera);

	// Add OrbitControls
	camera_controller = new THREE.OrbitControls(camera, renderer.domElement);
	camera_controller.target = new THREE.Vector3(zmax/(2*measure),0,0);
	camera.updateProjectionMatrix();

	// Deal with resizing
	window.addEventListener('resize', function() {
	    var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	    renderer.setSize(WIDTH, HEIGHT);
	    camera.aspect = WIDTH / HEIGHT;
	    camera.updateProjectionMatrix();
	});
    }
    
    // Rendering loop
    function animate() {
	if( url != controls.events ) {
	    url = controls.events;
	    scene.remove(container);
	    scene.remove(ch);
	    load_evd(url);
	}
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	camera_controller.update();
    }
    
    // Draw ball at position
    function make_ball(x, y, z, c, s){
        var hit = THREE.ImageUtils.loadTexture("images/ball.png");
	var material = new THREE.SpriteMaterial({
            map: hit, color: c});
	sprite = new THREE.Sprite(material);
	sprite.position.set(x, y, z);
        sprite.scale.set(s, s, 0);
        return sprite
    }

    // Load file
    function load_evd(url) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', function (event) {
            parse(event.target.responseText);
        }, false);
        request.open('GET', url, true);
        request.send(null);
    }

    // evd parser
    function parse(data) {
        container = new THREE.Object3D();
	var lines = data.split("\n");
	for(var i = 0; i < lines.length-1; i++){
	    var coord = lines[i].split(" ");
            var color = new THREE.Color().setHSL((coord[4]-219000)/10000,
                                                 1.0, 0.5);
            container.add(make_ball(parseFloat(coord[2]/measure),
                                    parseFloat(coord[0]/measure),
                                    parseFloat(coord[1]/measure),
                                    color,
                                    coord[3]/4096));
	}

	//Detector box
	var meshMaterial = new THREE.MeshBasicMaterial({wireframe: true});
	var cube = new THREE.Mesh( new THREE.BoxGeometry( zmax/measure,2.3,2.3 ), meshMaterial );
	ch = new THREE.EdgesHelper(cube);
	ch.position.set(zmax/(2*measure), 0, 0);
	ch.material.color.set(0x111111);
	ch.updateMatrix();
	scene.add(ch);	
	scene.add(container);
    }
    
    // Main function var controls;
    function setup_gui() {
	controls = { events: url };
	gui = new dat.GUI();
	gui.add(controls, 'events', ['data/evt1.txt',
				     'data/evt2.txt',
				     'data/evt3.txt',
				     'data/evt4.txt',
				     'data/evt5.txt',
				     'data/evt6.txt',
				     'data/evt7.txt',
				     'data/evt8.txt',
				     'data/evt9.txt',
				     'data/evt10.txt',]);
    }

    function main() {
	init();
	setup_gui();
	load_evd(url);
	animate();
    }
    main();
}) ();    
