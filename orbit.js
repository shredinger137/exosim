




var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    
    //Scene Settings
    var dtheta = 0.004; //planet orbital speed
    var pspin = .002; //planet spin horizontal
    var pspiny = .001; //planet spin vertical
    var starspin = .0002; //star rotation speed
    var pdiam = 2;
    var sundiam = 32;
    var radiusOrbit = 25;


    /******* Add the create scene function ******/
    var createScene = function () {



        // Create the scene space
        var scene = new BABYLON.Scene(engine);
        var envTexture = new BABYLON.CubeTexture("https://upload.wikimedia.org/wikipedia/commons/1/12/M35atlas.jpg", scene);
        scene.createDefaultSkybox(envTexture, true, 1000);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 90, new BABYLON.Vector3(0,0,0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 90));
        camera.attachControl(canvas, true);
        console.log("Camera position: " + camera.position.x + " " + camera.position.y + " " + camera.position.z);
        console.log("Camera rotation: " + camera.rotation.x + " " + camera.rotation.y + " " + camera.rotation.z);
        // Add lights to the scene
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, 0), scene);

        //GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.width = 0.2;
        rect1.height = "200px";
        rect1.cornerRadius = 20;
        rect1.color = "black";
        rect1.thickness = 4;
        rect1.background = "black";
        rect1.position = new BABYLON.Vector3(-1.4,-2,6);
        rect1.horizontalAlignment = "left";
        rect1.top = "160px";
        rect1.paddingLeft = "20px";
        advancedTexture.addControl(rect1);    


        // sun sphere
        var sun = BABYLON.Mesh.CreateSphere("sun", 16, sundiam, scene);
        sun.position = new BABYLON.Vector3(0, 0, 0);
        var sunMaterial = new BABYLON.StandardMaterial("sunmaterial", scene);
        sunMaterial.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg", scene);
        sun.material = sunMaterial;
        sun.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        console.log("Sun position: " + sun.position.x + " " + sun.position.y + " " + sun.position.z);


        // Add and manipulate meshes in the scene
        var planet = BABYLON.MeshBuilder.CreateSphere("planet", {diameter:pdiam}, scene);      
        var planetMaterial = new BABYLON.StandardMaterial("planetSurface", scene);
        planetMaterial.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/9/9a/Map_of_Ganymede_by_Bj%C3%B6rn_J%C3%B3nsson_and_centered_by_J_N_Squire.jpg", scene);
        planet.material = planetMaterial
        planet.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        planet.material.specularColor = new BABYLON.Color3(0, 0, 0);



             // Animations




        var rooted = (4 * Math.pow(camera.position.z, 4))/Math.pow((sundiam/2),2) - 4 * ((Math.pow(camera.position.z,2)/Math.pow(sundiam/2, 2)) + 1) * (Math.pow(camera.position.z, 2) - Math.pow(radiusOrbit, 2));
        var newintnumerator = ((-2 * Math.pow(camera.position.z, 2))/(sundiam /2)) + Math.sqrt(rooted);
        var newdenominator = 2 * (Math.pow(camera.position.z, 2)/Math.pow(sundiam/2, 2) + 1);
        var newint = newintnumerator / newdenominator;
        newint = Math.sqrt(Math.pow(newint, 2));
        console.log("New: " + newint);
    

        var alpha = 0;
        
        scene.beforeRender = function () {
		planet.position = new BABYLON.Vector3(radiusOrbit * Math.cos(alpha), planet.position.y, radiusOrbit * Math.sin(alpha));
        planet.rotation.x += pspin;
        planet.rotation.y += pspiny;
        sun.rotation.y += starspin;
        alpha += dtheta;
        if(planet.position.x >= -1 * newint && planet.position.x <= newint && planet.position.z > 0){console.log("int" + planet.position.x);}
            
    }

        return scene;
    };
    /******* End of the create scene function ******/    

    var scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () { 
            scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () { 
            engine.resize();
    });

// Create a canvas that extends the entire screen
// and it will draw righet\\t over the other html elements, like buttons, etc
var canvas2 = document.getElementById("overlayCanvas");

document.body.appendChild(canvas2);

//Then you can draw a point at (10,10) like this:

var ctx = canvas2.getContext("2d");
ctx.fillRect(10,10,10,10);