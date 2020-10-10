//stores a variable
var PLAY = 1;//declare the value equal to 1
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1,obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  //Helps in loading the animation
  trex_running = loadAnimation("trex1 (2).jpg","trex3 (2).jpg","trex4-1.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  //Helps in loadin Image
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("obstacle1-1.png")
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  obstacle5 = loadImage("obstacle5-1.png");
  obstacle6 = loadImage("obstacle6-1.png");
  
  restartImg = loadImage("restart-1.png")
  gameOverImg = loadImage("gameOver-1.png")
  
  //helps in loading sound
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
  //helps in displaying the message
 console.log(message)
  
  trex = createSprite(50,height-140,20,50);
  //adds the  loaded animation 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.shapeColor = "yellow";
  
  //changes the size of the sprite
  trex.scale = 0.5;
  
  ground = createSprite(200,height-80,400,20);
  ground.addImage("ground",groundImage);
  //changes the x position to half of its width
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,height-290);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,height-250);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
    invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //change the prperties of collider
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //helps in making the collider visible
  trex.debug = true
  
  //declares the value of score as zero
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
 
   fill("red");
  text("Score: "+ score, 500,50);
  
  //if game state is play then only thw things written inside should happen
  if(gameState === PLAY){

   // make the gameover and restart sprite invisible
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //if score is greater than 0 and equal to 100 the thing written inside should happen
    
    if(score>0 && score%100 === 0){
       //helps in playing the sound
       checkPointSound.play() 
    }
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 400) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //if the obtscales group is touching trex then only things written inside should happen
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //helps to set velocity of each thing in the group to be zero
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);   
     
     //if mouse is clicked on a sprite
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-100,10,40);
   //helps in increasing the speed automatically after it reaches a certain score
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {

      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
       case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.shapeColor = "blue";
    //declare the yposition of cloud randomly between the number
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

