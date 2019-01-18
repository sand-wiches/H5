//�����ʼ��Ϸ-->startPage��ʧ--����Ϸ��ʼ
//�������ʳ����������߿�ʼ�˶�
//��������--���ı䷽���˶�
//�жϳٵ�ʳ��--��ʳ����ʧ,�߼�һ
//�ж���Ϸ������������
var snakeMove;
var startGameBool = true;
var startPaushBool = true;
var speed = 200;//ÿ��200ms�͵���
var scoreBox = document.getElementById("score");//����ʹ��document.getElementsByClassName('score')[0];����ById
var content = document.getElementById('content');//document.getElementsByClassname('content')���ص���һ�����飬arguments��������,ById�Ƕ���
var lose = document.getElementById("lose");
var loserScore = document.getElementById("loserScore");
var startPaush = document.getElementById("startPaush");//��ʼ��ť
var close = document.getElementById("close");
var startBtn = document.getElementById('startBtn');
var startPage = document.getElementById("startPage");//��ʼ��ϷLOGO


init();//ҳ���������ִ��init()����
function init(){//������������this�����Բ�ҪҲ������ʹ��,����ı�������ȫ�ֱ���
	//��ͼ
	this.mapW =parseInt(getComputedStyle(content).width);//ָ�������ܻ������߽�
	this.mapH =parseInt(getComputedStyle(content).height);//ָ�������ܻ������߽�
	this.mapDiv = content;//Ϊ�˸���������ߺ�ʳ���<div>��׼��
	//ʳ��
	this.foodW = 20;
	this.foodH = 20;
	this.foodX = 0;
	this.foodY = 0;
	this.snakeW = 20;
	this.snakeH = 20;
	this.snakeBody = [[4,1,"head"],[3,1,"body"],[2,1,"body"]];//�������head,body,body���õ���CSS�����.head.body
	//this.snakeBody = [[5//x��,3//Y��,"head"],[4,3,"body"],[3,3,"body"]];
	//��Ϸ����
	this.direct = "right";//��ǰ����Ϊ�ҵ�ʱ������Ұ����������ã�ֻ���Ϻ��µİ���������
	this.left = false;//��ǰ����Ϊ�ҵ�ʱ�����Ʋ���
	this.right = false;//��ǰ����Ϊ�ҵ�ʱ�����Ʋ���
	this.up = true;//��ǰ����Ϊ�ҵ�ʱ�򣬿�������
	this.down = true;//��ǰ����Ϊ�ҵ�ʱ�򣬿�������
	this.score = 0;
	scoreBox.innerHTML = this.score;//����
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
	this.foodX = Math.floor(Math.random() * (this.mapW/ 20));//��20Ϊһ�������
	this.foodY = Math.floor(Math.random() * (this.mapH/ 20));
	food.style.left = this.foodX * 20 + 'px';
	food.style.top = this.foodY * 20 + 'px';
	food.style.position = 'absolute';
	this.mapDiv.appendChild(food).setAttribute('class','food');//Сдappendchild�ᱨ��JS�������ִ�Сд
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
		snake.style.left = this.snakeBody[i][0] * 20 + "px";//[0]ָ����[3,1,"head"]����ĵ�0����Ҳ����3,Ҳ����X��
		snake.style.top = this.snakeBody[i][1] * 20 + "px";//[1]ָ����[3,1,"head"]����ĵ�0����Ҳ����1��Ҳ����Y��
		snake.classList.add(this.snakeBody[i][2]);
		this.mapDiv.appendChild(snake).classList.add("snake");//�����snakeָ���������snake = document.creat...
		switch(this.direct){//��ת
			case "right":
				break;//��ֹ��͸
			case "up":
				snake.style.transform = "rotate(270deg)";
				break;//��ֹ��͸
			case "left":
				snake.style.transform = "rotate(180deg)";
				break;//��ֹ��͸
			case "down":
				snake.style.transform = "rotate(90deg)";
				break;//��ֹ��͸
			default:
				break;
		}
	}
}

function move(){//�ƶ��Ǹ���snakeBody�ı䷽���
	for(var i = this.snakeBody.length - 1; i>0; i--){//���ܴ�0��ʼ����Ϊ[0-1]��undefined,for(var i = this.snakeBody.length - 1; i>0; i--)length-1��ָ���һ�������ԴӺ���ǰѭ��
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];//ǰһλX����ں�һλ��ֵX��,ֻҪ�ı�ͷ���ķ�������Ҳ����Ÿı�
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];//ǰһλY����ں�һλ��ֵY��,ֻҪ�ı�ͷ���ķ�������Ҳ����Ÿı�
	}
	switch (this.direct) {
		case "right":
			this.snakeBody[0][0] += 1;//ȫ�ֱ���this.snakeBodyҲ��ı�
			break;//��ֹ��͸
		case "up":
			this.snakeBody[0][1] -= 1;
			break;//��ֹ��͸
		case "left":
			this.snakeBody[0][0] -= 1;
			break;//��ֹ��͸
		case "down":
			this.snakeBody[0][1] += 1;
			break;//��ֹ��͸
		default:
			break;
	}

	removeClass("snake");//�Ƴ�class����
	snake();//������Ⱦrender snake

 //�߳Ե�ʳ�����䳤
	if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY ){//����ͷ��ʳ��������ȣ��߳Ե�ƻ��
		var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];//length - 1�����һλ����˼�����һλ��X����
		var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];//length - 1�����һλ����˼�����һλ��X����
		switch (this.direct) {
			case "right":
				this.snakeBody.push([snakeEndX + 1,snakeEndY,"body"]);//���������ұߣ�X+1,Y���䣬������һ��
				break;//��ֹ��͸
			case "up":
				this.snakeBody.push([snakeEndX,snakeEndY + 1,"body"]);//push������API
				break;//��ֹ��͸
			case "left":
				this.snakeBody.push([snakeEndX - 1,snakeEndY,"body"]);
				break;//��ֹ��͸
			case "down":
				this.snakeBody.push([snakeEndX,snakeEndY + 1,"body"]);
				break;//��ֹ��͸
			default:
				break;
	}
		//����ͷ��ʳ��������ȣ�����+1
		this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass('food');
        food();
	}

	//��ͷײ���߽磬��Ϸ����
	if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW/20){//���ƶ�����ͷ��X�����content�߿��غ�
		relodGame();
	}
	if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH/20){//���ƶ�����ͷ��Y�����content�߿��غ�
		relodGame();
	}
	/*if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) {
		this.relodGame();//����Ϊʲôthis.relodGame();�����ã�����̨��ʾthis.relodGame is not a function,Ҫ��Դ�ļ�������˳���źã��Ų��ᱨ��
    }
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) {
        this.relodGame();//����Ϊʲôthis.relodGame();�����ã�����̨��ʾthis.relodGame is not a function,Ҫ��Դ�ļ�������˳���źã��Ų��ᱨ��
    }*/
	var snakeHX = this.snakeBody[0][0];
	var snakeHY = this.snakeBody[0][1];
	for(var i = 1; i < this.snakeBody.length; i++){
		if(snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]){
			this.relodGame();
		}
	}
}
	function relodGame(){//��Ϸ������ʾҳ��
		removeClass("snake");
		removeClass("food");
		clearInterval(snakeMove);
		startPaush.setAttribute("src","./img/start.png");
		this.snakeBody = [[4,1,"head"],[3,1,"body"],[2,1,"body"]];//[[4/X��,1//Y��,"head"],[3,1,"body"],[2,1,"body"]
		this.direct = "right";//��ǰ����Ϊ�ҵ�ʱ������Ұ����������ã�ֻ���Ϻ��µİ���������
		this.left = false;
		this.right = false;
		this.up = true;
		this.down = true;
		startGameBool = true;
		startPaushBool = true;
		lose.style.display = "block";//��ʾ����ҳ�棬��ʾ����
		loserScore.innerHTML = this.score;
		this.score = 0;
		scoreBox.innerHTML = this.score;//��ʾ����ҳ�棬��ʾ����
			
	}

	function removeClass(className){//��װ�Ƴ�className
	var ele = document.getElementsByClassName(className);
	while(ele.length > 0){
		ele[0].parentNode.removeChild(ele[0]);//�Ƴ���ͷ
	}
}
	
	//function bindEvent(){//�󶨼����ƶ��¼�
	//document.onkeydown = function(e/*e�Ƿ�ֹð���¼�*/){
		/**var code = e.keyCode
		setDerict(code);**/
	//}
	//startBtn.onclick = function (){
		//startAndPaush();
	//}

	//startPaush.onclick = function(){
		//startAndPaush();
	//}
	//close.onclick = function(){//�رհ�ť���¼�
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
   






function setDerict(code){//���¼����ƶ�
	switch(code){//code��case:37,38,39,40���Ƚϣ����ƥ�䣬ִ����Ӧ����
		case 37://���Ӧ�ķ��������
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
//��ʼ����ͣ��Ϸ �߼���װ
function startAndPaush(){
	if(startPaushBool){
		if(startGameBool){
			startGame();
			startGameBool = false;
		}
		startPaush.setAttribute("src","./img/pause.png");
		snakeMove = setInterval(function(){
			move();
		document.onkeydown = function(e){//e�Ƿ�ֹð���¼�
			var code = e.keyCode ;//onkeydown,���·������ת���ɴ���
			setDerict(code);
		}
		
	},speed);//ÿ200ms��ˢ��һ��
	startPaushBool = false;
	} else {
	startPaush.setAttribute("src","./img/start.png");
	clearInterval(snakeMove);//����ʱ��
	document.onkeydown = function(e){
		e.returnValue = false;
		return false;
	};
	startPaushBool = true;
	}
}
