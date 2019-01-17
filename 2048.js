function setCookie(cname,val){
		var date=new Date();
		date.setDate(date.getDate()+10);
		document.cookie=cname+"="+val+";expires="+date.toGMTString();
}
function getCookie(cname){
	var str=document.cookie;
	var i=str.indexOf(cname);
	if(i!=-1){
		i=i+cname.length+1;
		var endi=str.indexOf(";",i);
		return str.slice(i,endi!=-1?endi:str.length);
	}
}
var game={
	data:null,
	RN:4,
	CN:4,
	CSIZE:100,//保存格子的大小
	OFFSET:16,//保存格子间的距离
	score:0,//保存当前得分
	state:1,//保存游戏状态
	RUNNING:1,
	GAMEOVER:0,
	top:0,//保存最高分
	init:function(){
		this.top=getCookie("top")||0;//以防开始时没有top值，设为0
		console.log(this.top);
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		var html='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
		html+='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
		var gp=document.getElementById("gridPanel");
		gp.innerHTML=html;
		var width=this.CN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		var height=this.RN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		gp.style.width=width+"px";
		gp.style.height=height+"px";
	},
	//强调：
		//1、对象自己的方法，用到自己的属性时，必须用this.
		//2、每个属性和方法之间，都要用逗号隔开
	start:function(){//启动游戏
	  this.init();
	  this.state=this.RUNNING;//重置游戏状态为运行
	  this.score=0;
	 //创建空数组保存到data属性中
	  this.data=[];
	  //r从0开始，到<RN结束
	  for(var r=0;r<this.RN;r++){
		 //向data中压入一个空数组
		this.data.push([]);
		//c从0开始，到<CN结束
		for(var c=0;c<this.CN;c++){
			//向data中r行的子数组压入一个0
			this.data[r].push(0);
		}
	  }//循环结束
	  this.randomNum();
	  this.randomNum();
	  this.updateView();
	  //为当前页面绑定键盘按下
	  document.onkeydown=function(e){
		switch(e.keyCode){
			case 37:this.moveLeft();break;
			case 38:this.moveUp();break;
			case 39:this.moveRight();break;
			case 40:this.moveDown();break;
		}
	  }.bind(this);
	  //console.log(this.data.join("\n"));
	},
	//在data中一个随机的空位置，生成2或4
	randomNum:function(){
		while(true){
			//在0~RN-1之间生成一个随机的整数，保存在r中
			var r=parseInt(Math.random()*this.RN);
			//在0~CN-1之间生成一个随机的整数，保存在c中
			var c=parseInt(Math.random()*this.CN); 
			//如果data中r行c列为0
			if(this.data[r][c]==0){
				//将data中r行c列赋值为：
					//0~1随机生成一个小数，如果<0.5,赋值为2，否则赋值为4
				this.data[r][c]=Math.random()<0.5?2:4;
				//退出循环
				break;
			}
		}		
	},
	updateView:function(){//将data的数据更新到页面
		//遍历data
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]!=0){
					div.innerHTML=this.data[r][c];
					div.className="cell n"+this.data[r][c];
				}
				else{
					div.innerHTML="";
					div.className="cell";
				}
			}
		}
		document.getElementById("score").innerHTML=this.score;
		document.getElementById("top").innerHTML=this.top;
		var gameOver=document.getElementById("gameOver");
		if(this.state==this.GAMEOVER){
			gameOver.style.display="block";
			document.getElementById("fScore").innerHTML=this.score;
		}
		else{
			gameOver.style.display="none";
		}
	},
	//可重构函数
	move:function(fun){
		if(this.state==this.RUNNING){
			var before=String(this.data);
			fun();
			var after=String(this.data);
			if(before!=after){
				//修改游戏状态为PLAYING
				this.state=this.PLAYING;
				animation.play(
					function() {
						this.randomNum();
						if (this.isGameOver()) {
							this.state = this.GAMEOVER;
							//如果score>top
							if (this.score > this.top) {
								setCookie("top", this.score);
								console.log(this.top);
							}
						}
						this.updateView();
						//修改状态回RUNNING
						this.state=this.RUNNING;
					}.bind(this));
			}
		}

	},
	isGameOver:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}
				if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
					return false;
				}
				if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
					return false;
				}
			}
		}
		return true;
	},
	//左移
	moveLeft:function(){
		this.move(function(){
			for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);
			}
		}.bind(this));
	},
	moveLeftInRow:function(r){//左移第r行
		for(var c=0;c<this.CN-1;c++){
			var nextc=this.getNextInRow(r,c);
			if(nextc==-1){
				break;
			}
			else if(this.data[r][c]==0){
				this.data[r][c]=this.data[r][nextc];
				animation.addTask(r,c,r,nextc);
				this.data[r][nextc]=0;
				c--;
			}
			else if(this.data[r][c]==this.data[r][nextc]){
				this.data[r][c]*=2;
				animation.addTask(r,c,r,nextc);
				this.score+=this.data[r][c];
				this.data[r][nextc]=0;
			}
		}
	},
	getNextInRow:function(r,c){//查找r行c列右侧下一个不为0的位置
		for(var nextc=c+1;nextc<this.CN;nextc++){
			if(this.data[r][nextc]!=0)
				return nextc;
		}
		return -1;
	},
	//右移
	moveRight:function(){
		this.move(function(){
			for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
			}
		}.bind(this));
	},
	moveRightInRow:function(r){
		for(var c=this.CN-1;c>0;c--){
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){break;}
			else if(this.data[r][c]==0){
				this.data[r][c]=this.data[r][prevc];
				animation.addTask(r,c,r,prevc);
				this.data[r][prevc]=0;
				c++;
			}
			else if(this.data[r][c]==this.data[r][prevc]){
				this.data[r][c]*=2;
				animation.addTask(r,c,r,prevc);
				this.score+=this.data[r][c];
				this.data[r][prevc]=0;
			}
		}
	},
	getPrevInRow:function(r,c){
		for(var prevc=c-1;prevc>=0;prevc--){
			if(this.data[r][prevc]!=0)
				return prevc;
		}
		return -1;
	},
	//上移
	moveUp:function(){
		this.move(function(){
			for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
			}
		}.bind(this));
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){break;}
			else if(this.data[r][c]==0){
				this.data[r][c]=this.data[nextr][c];
				animation.addTask(r,c,nextr,c);
				this.data[nextr][c]=0;
				r--;
			}
			else if(this.data[r][c]==this.data[nextr][c]){
				this.data[r][c]*=2;
				this.score+=this.data[r][c];
				animation.addTask(r,c,nextr,c);
				this.data[nextr][c]=0;
			}
		}
	},
	getNextInCol:function(r,c){
		for(var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0)
				return nextr;
		}
		return -1;
	},
	//下移
	moveDown:function(){
		this.move(function(){
			for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}	
		}.bind(this));
	},
	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){break;}
			else if(this.data[r][c]==0){
				this.data[r][c]=this.data[prevr][c];
				animation.addTask(r,c,prevr,c);
				this.data[prevr][c]=0;
				r++;
			}
			else if(this.data[r][c]==this.data[prevr][c]){
				this.data[r][c]*=2;
				animation.addTask(r,c,prevr,c);
				this.score+=this.data[r][c];
				this.data[prevr][c]=0;
			}
		}
	},
	getPrevInCol:function(r,c){
		for(var prevr=r-1;prevr>=0;prevr--){
			if(this.data[prevr][c]!=0)
				return prevr;
		}
		return -1;
	}
}
//页面加载后，自动启动游戏
window.onload=function(){
	game.start();
}
//debug：
//1、debugger：让程序停在关键位置，鼠标移入可能出错的变量，实时查看变量值
//2、打桩：在程序关键位置输出关键变量的值