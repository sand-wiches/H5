//点击开始游戏-->startPage消失--》游戏开始
//随机出现食物，出现三节蛇开始运动
//上下左右--》改变方向运动
//判断迟到食物--》食物消失,蛇加一
//判断游戏结束，弹出框
var snakeMove;
var startGameBool = true;
var startPaushBool = true;
var speed = 200;//每隔200ms就调用
var scoreBox = document.getElementById("score");//可以使用document.getElementsByClassName('score')[0];代替ById
var content = document.getElementById('content');//document.getElementsByClassname('content')返回的是一个数组，arguments是类数组,ById是对象
var lose = document.getElementById("lose");
var loserScore = document.getElementById("loserScore");
var startPaush = document.getElementById("startPaush");//开始按钮
var close = document.getElementById("close");
var startBtn = document.getElementById('startBtn');
var startPage = document.getElementById("startPage");//开始游戏LOGO


init();//页面加载马上执行init()函数
function init(){//这整个函数的this都可以不要也能正常使用,下面的变量都是全局变量
	//地图
	this.mapW =parseInt(getComputedStyle(content).width);//指的是蛇能活动的区域边界
	this.mapH =parseInt(getComputedStyle(content).height);//指的是蛇能活动的区域边界
	this.mapDiv = content;//为了给后面加入蛇和食物的<div>做准备
	//食物
	this.foodW = 20;
	this.foodH = 20;
	this.foodX = 0;
	this.foodY = 0;
	this.snakeW = 20;
	this.snakeH = 20;
	this.snakeBody = [[4,1,"head"],[3,1,"body"],[2,1,"body"]];//数组这的head,body,body引用的是CSS里面的.head.body
	//this.snakeBody = [[5//x轴,3//Y轴,"head"],[4,3,"body"],[3,3,"body"]];
	//游戏属性
	this.direct = "right";//当前方向为右的时候，左和右按键都不可用，只有上和下的按键可以用
	this.left = false;//当前方向为右的时候，左移不行
	this.right = false;//当前方向为右的时候，右移不行
	this.up = true;//当前方向为右的时候，可以上移
	this.down = true;//当前方向为右的时候，可以下移
	this.score = 0;
	scoreBox.innerHTML = this.score;//分数
    bindEvent();
}
function startGame(){
	startPage.style.display = "none";
	startPaush.style.display = "block";
	food();
	snake();
	//bindEvent(); 
}
function food(){
	var food = document.createElement('div');
	food.style.width = this.foodW + 'px';
	food.style.height = this.foodH + 'px';
	this.foodX = Math.floor(Math.random() * (this.mapW/ 20));//以20为一个坐标点
	this.foodY = Math.floor(Math.random() * (this.mapH/ 20));
	food.style.left = this.foodX * 20 + 'px';
	food.style.top = this.foodY * 20 + 'px';
	food.style.position = 'absolute';
	this.mapDiv.appendChild(food).setAttribute('class','food');//小写appendchild会报错，JS里面区分大小写
}

/**function food() {
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    
    this.foodX = Math.floor(Math.random() * (this.mapW / 20));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20));
    
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';

    food.style.position = 'absolute';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}**/
function snake(){
	for(var i = 0; i < this.snakeBody.length; i++){
		var snake = document.createElement("div");
		snake.style.width = this.snakeW + "px";//20
		snake.style.height = this.snakeH + "px";//20
		snake.style.position = "absolute";
		snake.style.left = this.snakeBody[i][0] * 20 + "px";//[0]指的是[3,1,"head"]里面的第0个，也就是3,也就是X轴
		snake.style.top = this.snakeBody[i][1] * 20 + "px";//[1]指的是[3,1,"head"]里面的第0个，也就是1，也就是Y轴
		snake.classList.add(this.snakeBody[i][2]);
		this.mapDiv.appendChild(snake).classList.add("snake");//这儿的snake指的是上面的snake = document.creat...
		switch(this.direct){//旋转
			case "right":
				break;//防止穿透
			case "up":
				snake.style.transform = "rotate(270deg)";
				break;//防止穿透
			case "left":
				snake.style.transform = "rotate(180deg)";
				break;//防止穿透
			case "down":
				snake.style.transform = "rotate(90deg)";
				break;//防止穿透
			default:
				break;
		}
	}
}

function move(){//移动是根据snakeBody改变方向的
	for(var i = this.snakeBody.length - 1; i>0; i--){//不能从0开始，因为[0-1]是undefined,for(var i = this.snakeBody.length - 1; i>0; i--)length-1是指最后一个，所以从后往前循环
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];//前一位X轴等于后一位的值X轴,只要改变头部的方向，其他也会跟着改变
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];//前一位Y轴等于后一位的值Y轴,只要改变头部的方向，其他也会跟着改变
	}
	switch (this.direct) {
		case "right":
			this.snakeBody[0][0] += 1;//全局变量this.snakeBody也会改变
			break;//防止穿透
		case "up":
			this.snakeBody[0][1] -= 1;
			break;//防止穿透
		case "left":
			this.snakeBody[0][0] -= 1;
			break;//防止穿透
		case "down":
			this.snakeBody[0][1] += 1;
			break;//防止穿透
		default:
			break;
	}

	removeClass("snake");//移除class属性
	snake();//重新渲染render snake

 //蛇吃掉食物，身体变长
	if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY ){//当蛇头和食物坐标相等，蛇吃掉苹果
		var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];//length - 1是最后一位，意思是最后一位的X坐标
		var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];//length - 1是最后一位，意思是最后一位的X坐标
		switch (this.direct) {
			case "right":
				this.snakeBody.push([snakeEndX + 1,snakeEndY,"body"]);//当方向是右边，X+1,Y不变，身体变多一个
				break;//防止穿透
			case "up":
				this.snakeBody.push([snakeEndX,snakeEndY + 1,"body"]);//push是数组API
				break;//防止穿透
			case "left":
				this.snakeBody.push([snakeEndX - 1,snakeEndY,"body"]);
				break;//防止穿透
			case "down":
				this.snakeBody.push([snakeEndX,snakeEndY + 1,"body"]);
				break;//防止穿透
			default:
				break;
	}
		//当蛇头和食物坐标相等，分数+1
		this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass('food');
        food();
	}

	//蛇头撞到边界，游戏结束
	if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW/20){//当移动的蛇头的X坐标和content边框重合
		relodGame();
	}
	if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH/20){//当移动的蛇头的Y坐标和content边框重合
		relodGame();
	}
	/*if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) {
		this.relodGame();//不懂为什么this.relodGame();不能用，控制台显示this.relodGame is not a function,要按源文件的排列顺序排好，才不会报错
    }
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) {
        this.relodGame();//不懂为什么this.relodGame();不能用，控制台显示this.relodGame is not a function,要按源文件的排列顺序排好，才不会报错
    }*/
	var snakeHX = this.snakeBody[0][0];
	var snakeHY = this.snakeBody[0][1];
	for(var i = 1; i < this.snakeBody.length; i++){
		if(snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]){
			this.relodGame();
		}
	}
}
	function relodGame(){//游戏结束显示页面
		removeClass("snake");
		removeClass("food");
		clearInterval(snakeMove);
		startPaush.setAttribute("src","./img/start.png");
		this.snakeBody = [[4,1,"head"],[3,1,"body"],[2,1,"body"]];//[[4/X轴,1//Y轴,"head"],[3,1,"body"],[2,1,"body"]
		this.direct = "right";//当前方向为右的时候，左和右按键都不可用，只有上和下的按键可以用
		this.left = false;
		this.right = false;
		this.up = true;
		this.down = true;
		startGameBool = true;
		startPaushBool = true;
		lose.style.display = "block";//显示结束页面，显示分数
		loserScore.innerHTML = this.score;
		this.score = 0;
		scoreBox.innerHTML = this.score;//显示结束页面，显示分数
			
	}

	function removeClass(className){//封装移除className
	var ele = document.getElementsByClassName(className);
	while(ele.length > 0){
		ele[0].parentNode.removeChild(ele[0]);//移除蛇头
	}
}
	
	//function bindEvent(){//绑定键盘移动事件
	//document.onkeydown = function(e/*e是防止冒泡事件*/){
		/**var code = e.keyCode
		setDerict(code);**/
	//}
	//startBtn.onclick = function (){
		//startAndPaush();
	//}

	//startPaush.onclick = function(){
		//startAndPaush();
	//}
	//close.onclick = function(){//关闭按钮绑定事件
		//lose.style.display = "none";
		//}
	//}
/**function bindEvent() {
    startBtn.onclick = function(){
        startAndPaush();        
    }
    startPaush.onclick = function () {
        startAndPaush();
    }
    close.onclick = function () {
        lose.style.display = 'none';
    }
}
**/
   






function setDerict(code){//按下键盘移动
	switch(code){//code与case:37,38,39,40做比较，如果匹配，执行相应代码
		case 37://相对应的方向键代码
		if(this.left){
			this.direct = "left";
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;
		case 38:
		if(this.up){
			this.direct = "up";
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}
		break;
		case 39:
		if(this.right){
			this.direct = "right";
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;
		case 40:
		if(this.down){
			this.direct = "down";
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}
		break;
	default:
		break;
	}
}

 function bindEvent() {
    startBtn.onclick = function(){
        startAndPaush();        
    }
    startPaush.onclick = function () {
        startAndPaush();
    }
    close.onclick = function () {
        lose.style.display = 'none';
    }
}
//开始和暂停游戏 逻辑封装
function startAndPaush(){
	if(startPaushBool){
		if(startGameBool){
			startGame();
			startGameBool = false;
		}
		startPaush.setAttribute("src","./img/pause.png");
		snakeMove = setInterval(function(){
			move();
		document.onkeydown = function(e){//e是防止冒泡事件
			var code = e.keyCode ;//onkeydown,按下方向键，转换成代码
			setDerict(code);
		}
		
	},speed);//每200ms就刷新一次
	startPaushBool = false;
	} else {
	startPaush.setAttribute("src","./img/start.png");
	clearInterval(snakeMove);//清理定时器
	document.onkeydown = function(e){
		e.returnValue = false;
		return false;
	};
	startPaushBool = true;
	}
}
