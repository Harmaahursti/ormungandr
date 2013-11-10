/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

window.onload= function()
{
    
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    score = 0,
    level = 0,
    direction = 0,
    snake = new Array(3),
    active = true,
    speed = 500;
    
    //Initialize the playfield
    var map = new Array(20);
    for (var i = 0; i < map.length;i++){
      map[i] = new Array(20);
    }
    
    canvas.width = 204;
    canvas.height = 224;
    
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    
    // Add the snake
    map = generateSnake(map);
    
    //add the food
    map = generateFood(map);
    
    drawGame();
    
    // movement buttons
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });
    
    function drawGame()
    {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Traverse all the body pieces of the snake, starting from the last one 
        for(var i = snake.length - 1; i >=0; i--){
            
            // collision detection using the head only
            //Requires separate code
            if(i === 0) {
                switch(direction){
                    case 0: //right
                        snake[0] = {x:snake[0].x +1, y:snake[0].y }
                        break;
                    case 1: //left
                        snake[0] = {x:snake[0].x, y:snake[0].y }
                        break;
                    case 2: //up
                        snake[0] = {x: snake[0].x, y:snake[0].y -1}
                        break;
                    case 3://down
                        snake[0] = {x:snake[0].x, y:snake[0].y + 1}
                        break;
                }
            
            // check that it's not out of bounds. If it's show the game over poup
            // and exit the function
            
            if (snake[0].x < 0 ||
                snake[0].x >= 20 ||
                snake[0].y < 0 ||
                snake[0].y >=20 ) {
                showGameOver();
                return;
                }
            //detect if we hit food and increase the score if it does,
            //generating a new food position in the process, and also
            //adding a new element to the snake array.
            if(map[snake[0].x][snake[0].y] === 1) {
                score += 10;
                map = generateFood(map);
                
                //add a new body piece to the array
                snake.push({x:snake[snake.length - 1].x, y:snake[snake.length -1].y});
                map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
                
                //if the score reaches 100 inrease level
                // level up = speed
                
                if((score % 100) === 0) {
                    level +=1;
                }
                
            } else if (map[snake[0].x][snake[0].y] === 2){
                showGameOver();
                return;
            }
            map[snake[0].x][snake[0].y] = 2;
        } else {
            // Ensuring that bodypieces follow the head
            //and clear the previous zone they inhabited
            if(i === (snake.length - 1)){
                map[snake[i].x][snake[i].y] = null;
            }
            snake[i] = {x:snake[i-1].x, y:snake[i-1].y};
            map[snake[i].x][snake[i].y] =2;
        }
      } 
        
   
        // Draw the border as well as the score
        drawMain();
        
        //Start cycling the matrix
        for(var x = 0; x < map.length; x++){
            for (var y =0; y < map[0].length; y++){
            if(map[x][y] === 1){
                ctx.fillStyle = 'black';
                ctx.fillRect(x * 10,y * 10 + 20, 10, 10);
            } else if (map[x][y] === 2){
                ctx.fillStyle = 'purple';
                ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
            }
         }
        }
        
        if (active){
            //cal the drawgame() function
            setTimeout (drawGame, speed - (level * 50));
        }
     }
    
  function drawMain()
  {  
    ctx.lineWidth = 2; // Border thickness will be 2 px
    ctx.strokeStyle = 'black';// borders will be black
    
    // The border is drawn outside of the rectangle, so
    // it needs to be moved a bit to right and up. Also,
    //going to leave 20px space on the top to draw the interface
    ctx.strokeRect(2, 20, canvas.width - 4, canvas.height - 24);
    
    ctx.font = '14px sans-serif';
    ctx.fillText('Score' + score + '-Level' + level, 2, 12);
  }
  
  function generateFood (map)
  {
      //generate a random position for the rows and the columns.
      var rndX = Math.round(Math.random() * 19),
          rndY = Math.round(Math.random() * 19);
  
      // No food to a location occupied by the snake
      while (map[rndX][rndY] === 2){
          rndX = Math.round(Math.random() * 19);
          rndY = Math.round(math.random() * 19);
      }
    
    map[rndX][rndY] = 1;
    
    return map;
  }
  
  function generateSnake(map)
  {
      //random position for the row and the column of the head
      var rndX = Math.round(Math.random() * 19),
          rndY = Math.round(Math.random() * 19);
  
     //Ensuring snake does not go out of bounds and
     //other body pieces do not generate outside the playzone
     
     while ((rndX - snake.length) < 0){
         rndX = Math.round(Math.random()* 19);
     }
     
     for(var i = 0; i < snake.length; i++){
         snake[i] = {x: rndX - i, y: rndY};
         map[rndX - i][rndY] = 2;
     } 
     
     return map;
     
  }
  function showGameOver(){
      // clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'black';
      ctx.font = '16px sans-serif';
      
      ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);
      
      ctx.font = '12px sans-serif';
      
      ctx.fillText('Your Score Was:' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width /2)), 70);
  }
  
}; 



