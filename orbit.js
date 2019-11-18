function simulatorScene(){

var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    
    //Scene Settings
    var dtheta = 0.004; //planet orbital speed
    var pspin = .002; //planet spin horizontal
    var pspiny = .001; //planet spin vertical
    var starspin = .0002; //star rotation speed
    var pdiam = 6;
    var sundiam = 40;
    var radiusOrbit = 35;

    var maxLoss = Math.pow(((pdiam / 2) * 4) / ((sundiam / 2) * 44), 2);
    console.log(maxLoss);

//One Sol radius is 695,510 km
//one Earth radius is 6,371 km
//Ratio r^2/rs^2 = 0.00008390
//In here, 20 = 695,000 km, or roughly 1 unit = ‭34,000 km for the star.
//Neptune has a radius of about 24,000km. That's our 6 unit default, so 1 unit is about 4000km.


    /******* Add the create scene function ******/
    var createScene = function () {



        // Create the scene space
        var scene = new BABYLON.Scene(engine);
      //  var envTexture = new BABYLON.CubeTexture("https://upload.wikimedia.org/wikipedia/commons/1/12/M35atlas.jpg", scene);
      //  scene.createDefaultSkybox(envTexture, true, 1000);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 115, new BABYLON.Vector3(0,0,0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 120));
        camera.attachControl(canvas, true);
        console.log("Camera position: " + camera.position.x + " " + camera.position.y + " " + camera.position.z);
        console.log("Camera rotation: " + camera.rotation.x + " " + camera.rotation.y + " " + camera.rotation.z);
        // Add lights to the scene
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, 0), scene);

        window.addEventListener("wheel", zoom);
        function zoom(event){
            var newCameraZ = event.deltaY + camera.position.z;
            camera.setPosition(new BABYLON.Vector3(0, 0, newCameraZ));
        }

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
        var sun = BABYLON.Mesh.CreateSphere("sun", 32, sundiam, scene);
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





        //compare position.x
   

        var alpha = 0;
        var occlusion = 0;
        var turn = 0;
        scene.beforeRender = function () {

            turn = turn + 1;

            var rooted = (4 * Math.pow(camera.position.z, 4))/Math.pow((sundiam/2),2) - 4 * ((Math.pow(camera.position.z,2)/Math.pow(sundiam/2, 2)) + 1) * (Math.pow(camera.position.z, 2) - Math.pow(radiusOrbit, 2));
            var newintnumerator = ((-2 * Math.pow(camera.position.z, 2))/(sundiam /2)) + Math.sqrt(rooted);
            var newdenominator = 2 * (Math.pow(camera.position.z, 2)/Math.pow(sundiam/2, 2) + 1);
            var newint = newintnumerator / newdenominator;
            newint = Math.sqrt(Math.pow(newint, 2)) + (pdiam / 2);
            var maxCross = newint - pdiam;
            var deltaTransit = (newint - (Math.sqrt(Math.pow(planet.position.x, 2)))) / pdiam;
         //   
    


		planet.position = new BABYLON.Vector3(radiusOrbit * Math.cos(alpha), planet.position.y, radiusOrbit * Math.sin(alpha));
        planet.rotation.x += pspin;
        planet.rotation.y += pspiny;
        sun.rotation.y += starspin;
        alpha += dtheta;
        if(planet.position.x >= -1 * newint && planet.position.x <= newint && planet.position.z > 0){
            if(deltaTransit < 1){
                occlusion = maxLoss * deltaTransit;
        } else{occlusion = maxLoss; } 
        //console.log("Light: " + ((1 - ((Math.round(occlusion * 100000)) / 100000)) * 100) + "%");
        if(turn > 60){
            graphPoint(occlusion);
            turn = 0;
        }   
}  else { if (turn > 80){graphPoint(0); turn = 0;}}
         
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

var canvas2 = document.getElementById("overlayCanvas");

document.body.appendChild(canvas2);


var ctx = canvas2.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var pointSeparation = 6;
var pointSize = 3;
var totalPoints = 1;
var prevx = 0;
var prevy = 0;



function graphPoint(occlusion){

    var pointy = ((occlusion * 100000)).toFixed(0);
    var pointx = (totalPoints * pointSeparation);
    console.log("pointx: " + pointx + ", pointy: " + pointy);
    if(pointx < document.width);
    ctx.fillRect(pointx, pointy, pointSize, pointSize);
    totalPoints = totalPoints + 1;

    ctx.beginPath();
    ctx.moveTo(prevx, prevy);
    ctx.lineTo(pointx, pointy);
    ctx.stroke();

    prevx = pointx;
    prevy = pointy;

}


}
//use this canvas to overlay a curve graph and other elements