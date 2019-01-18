function Task(div,stepL,stepT){
	this.div=div;
	this.stepL=stepL;
	this.stepT=stepT;
}
var animation={
	DURATION:1000,
	STEPS:100,
	interval:0,
	timer:null,
	moved:0,
	CSIZE:100,//保存格子的大小
	OFFSET:16,
	tasks:[],
	init:function(){
		this.interval=this.DURATION/this.STEPS;
	},
	//将要移动的div和步长添加到数组中
	addTask:function(endr,endc,startr,startc){
		var div=document.getElementById("c"+startr+startc);
		var stepL=(endc-startc)*(this.CSIZE+this.OFFSET)/this.STEPS;
		var stepT=(endr-startr)*(this.CSIZE+this.OFFSET)/this.STEPS;
		this.tasks.push(new Task(div,stepL,stepT));
	},
	play:function(callback){//启动动画
		this.timer=setInterval(this.playStep.bind(this,callback),this.interval);
	},
	playStep:function(callback){
		for(var i=0;i<this.tasks.length;i++){
			var div=this.tasks[i].div;
			var style=getComputedStyle(div);
			div.style.left=parseFloat(style.left)+this.tasks[i].stepL+"px";
			div.style.top=parseFloat(style.top)+this.tasks[i].stepT+"px";
		}
		this.moved++;//将moved+1
		//如果moved等于STEPS
		if(this.moved==this.STEPS){
			//停止定时器，清除timer，moved归0
			clearInterval(this.timer);
			this.timer=null;
			this.moved=0;
			//遍历tasks中每个task
			for(var i=0;i<this.tasks.length;i++){
				var div=this.tasks[i].div;
				//清除当前task的div的left
				div.style.left="";
				//清除当前task的div的top
				div.style.top="";
			}
			this.tasks=[];//重置tasks为空数组
			callback();//调用callback
		}
	}
}
animation.init();