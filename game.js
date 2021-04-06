const gameState={
  score:0
}

function preload() {
  this.load.image('background','assets/background.png');
  this.load.image('kang', 'assets/eagle.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('spike', 'assets/spike.png');
  this.load.image('platform', 'assets/platform.png');
  this.load.image('ground', 'assets/platform.png');
  
}

function create() {
  //backround
  let bg=this.add.image(0,0,'background').setScale(10,6);   
 gameState.kang = this.physics.add.sprite(100, 200, 'kang').setScale(.15);
 //platform
 const platforms = this.physics.add.staticGroup();
platforms.create(10,350, 'platform').setScale(.1, 10).refreshBody();
//ground
const grounds = this.physics.add.staticGroup();
grounds.create(100,innerHeight-35, 'ground').setScale(10, .5).refreshBody();
//side wall collide with player 
gameState.kang.setCollideWorldBounds(true);
this.physics.add.collider(gameState.kang, platforms);
//ground collide with player
gameState.kang.setCollideWorldBounds(true);
this.physics.add.collider(gameState.kang, grounds);
//
gameState.scoreText = this.add.text(45, 15, 'Score: 0', { fontSize: '25px',fontStyle:"bold", fill: '#000000' })
 gameState.cursors= this.input.keyboard.createCursorKeys();
 //touch events
 gameState.kang.setInteractive().on('pointerup',function(){
     gameState.kang.setVelocityY(-150);
});
// enmeies
const enemies = this.physics.add.group();
  function enemyGen(){
    const yCoord = Math.random() * innerHeight;
    let arr=["enemy",
    "spike"];
    let randomEnemy = arr[Math.floor(Math.random()*arr.length)];
    //console.log(randomEnemy);
    enemies.create(innerWidth-100,yCoord,randomEnemy).setScale(.35);
    enemies.setVelocityX(-150);
    enemies.setVelocityY(-100);
  
  }
  enemyGen();
  // enemey generator loop
  const enemyGenLoop = this.time.addEvent({
    delay: 1000,
    callback: enemyGen,
    callbackScope: this,
    loop: true
  });
  // enemy hit wall logic
  this.physics.add.collider(enemies, platforms, function(enemy){
    enemy.destroy();
    gameState.score += 10;
   gameState.scoreText.setText(`Score: ${gameState.score}`)
  });
  // enemy hit ground condition
  //this.physics.add.collider(enemies, grounds, function(enemy){
    //enemy.destroy();
   // gameState.score += 5;
   //gameState.scoreText.setText(`Score: ${gameState.score}`)
  //});
  
  //game over condition if player collides with enemy
 
  this.physics.add.collider(gameState.kang,enemies, () => {
    enemyGenLoop.destroy();
   this.physics.pause();
   this.add.text(350, 220, 'Game Over', { fontSize: '45px',lineHeight:'55px',fontFamily:'monospace', fill: '#000000' });
   this.add.text(350, 300, 'Click to Restart ', { fontSize: '25px',lineHeight:'55px', fill: '#000000' });
  
   this.input.on('pointerup',()=>{
    gameState.score=0;
    this.scene.restart();
  })
  });

}

// Create your update() function here
function update(){
  //kang.x+=1;
 
  if(gameState.cursors.up.isDown){
      gameState.kang.setVelocityY(-150);
  }
  else if(gameState.cursors.right.isDown){
      gameState.kang.setVelocityX(150);
  }
  else if(gameState.cursors.left.isDown){
      gameState.kang.setVelocityX(-150);
  }
  else if(gameState.cursors.down.isDown){
      gameState.kang.setVelocityY(150);
  }
  else{
      gameState.kang.setVelocityX(0);
  }

}


const config = {
	type: Phaser.AUTO,
	width: innerWidth,
	height: innerHeight,
	//backgroundColor: "#ADD8E6",
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:150},
            enableBody:true
        }
    },
	scene: {
    preload,
    create,
    update,
  
  
    // Include update here!
	}
}

const game = new Phaser.Game(config);