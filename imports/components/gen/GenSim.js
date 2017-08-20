import * as PIXI from 'pixi.js';

import {Transform} from './Transform.js';

var stage = null;
var renderer = null;

var MAX_ACCEL = 1;
var MAX_STEER = Math.PI/32;
var GLOBAL_DAMP = 0.95;
var GENE_LENGTH = 21;

var SIM_SPEED = 1;

var maxAccelSlider;
var maxStearSlider;
var simSpeedSlider;

var genesIdCounter = 0;
var genesList = [];

var textList = []

function clamp(value, lo, hi){
	return Math.min(Math.max(value, lo),hi);
}

function makeSlider(_min, _max, _step, _name = "default"){
	var sliderContainer = document.createElement("DIV");
	sliderContainer.setAttribute("style", "position:relative;float:right; right: 0;font-size:16px;clear:both;");

	sliderContainer.innerHTML = _name + " : ";
	var retSlider = document.createElement("INPUT");
	retSlider.setAttribute("type", "range");
	retSlider.setAttribute("style", "position:relative; padding: 0px");
	retSlider.min = _min;
	retSlider.max = _max;
	retSlider.step = _step;
	sliderContainer.appendChild(retSlider);
	sliderContainer.slider = retSlider;
	return sliderContainer;
}

function wrap(b){
	if(b.transform.x<0-b.radius) b.transform.x += 400+b.radius;
	if(b.transform.y<0-b.radius) b.transform.y += 300+b.radius;
	if(b.transform.x>399+b.radius) b.transform.x -= 400+b.radius;
	if(b.transform.y>299+b.radius) b.transform.y -= 300+b.radius;
}

function generateRandomGeneString(length, clampLow = -1, clampHigh = 1){

	var ret = [];
	var i = length;
	while(i--){
		ret.push(Math.random() * (clampHigh - clampLow) + clampLow);
	}

	return ret;
}

function dotProduct(a, b){
	var ret = 0;
	var i = a.length;
	while(i--){
		ret += a[i] * b[i];
	}

	return ret;
}

function crossOver(a, b){
	var ret = new Genes(GENE_LENGTH, 0);
	var cPoint = Math.floor(Math.random() * GENE_LENGTH);
	if(Math.random() > 0.5){
		ret.geneString = a.geneString.slice(0, cPoint).concat(b.geneString.slice(cPoint,GENE_LENGTH));
	}else{
		ret.geneString = b.geneString.slice(0, cPoint).concat(a.geneString.slice(cPoint,GENE_LENGTH));
	}

	return ret;
}

class Genes{
	constructor(length, initial = null) {
		if(!initial){
			this.geneString = generateRandomGeneString(length);
		}else{
			this.geneString = [];
			var i = length;
			while(i--){
				this.geneString.push(initial);
			}
		}

		this.id = genesIdCounter++;

		this.fitness = 0;
		this.highestFitness = 0;
		this.trials = 0;
	}
}

class BigBoid{
	constructor(_x = 100, _y = 100, _radius = 50) {
		this.transform = new Transform(_x, _y);
		this.transform.setDamping(GLOBAL_DAMP);
		this.circle = null;
		this.radius = _radius;
		this.generateGraphics();

		this.targetPoint = {};
		this.targetPoint.x = 0;
		this.targetPoint.y = 0;
	}

	update(){
		var diffx = this.targetPoint.x - this.transform.x;
		var diffy = this.targetPoint.y - this.transform.y;

		var lenDiff = Math.sqrt(diffx * diffx + diffy * diffy);

		this.transform.ax = diffx/lenDiff * MAX_ACCEL/2;
		this.transform.ay = diffy/lenDiff * MAX_ACCEL/2;

		this.transform.update();

		var velLen = Math.sqrt(this.transform.vx * this.transform.vx + this.transform.vy * this.transform.vy);

		if(lenDiff<=velLen * 2){
			this.targetPoint.x = Math.random() * 400;
			this.targetPoint.y = Math.random() * 300;
		}

		this.circle.x = this.transform.x;
		this.circle.y = this.transform.y;
	}

	generateGraphics(){
		this.circle = new PIXI.Graphics();
		this.circle.beginFill(0); // replace with color from hash of gene
		this.circle.lineStyle(0.5,0x000000,1);
		this.circle.drawCircle(0,0,this.radius)
		this.circle.endFill();
		this.circle.x = this.transform.x;
		this.circle.y = this.transform.y;
		stage.addChild(this.circle);
	}
}

class Boid{
	constructor(_x = 100, _y = 100, _g=null) {
		this.transform = new Transform(_x, _y);
		this.transform.setDamping(GLOBAL_DAMP);
		this.triangle = new PIXI.Graphics();
		this.generateGraphics();
		stage.addChild(this.triangle);

		this.radius = 3;
		if(!_g){
			_g = new Genes(GENE_LENGTH);
			genesList.push(_g);
		}
		this.fitness = 0;
		this.steerGenes = _g;
	}

	control(_accel, _steer){
		_accel = clamp(_accel, 0, MAX_ACCEL);
		_steer = clamp(_steer, -MAX_STEER, MAX_STEER);

		this.transform.ax = Math.cos(this.transform.r) * _accel;
		this.transform.ay = Math.sin(this.transform.r) * _accel;
		this.transform.vr = _steer;

	}

	update(){

		this.transform.update();

		this.triangle.x = this.transform.x;
		this.triangle.y = this.transform.y;
		this.triangle.rotation = Math.atan2(this.transform.vy,this.transform.vx);
		this.fitness++;
		//if(this.steerGenes.highestFitness < this.fitness){
			///this.steerGenes.highestFitness = ((this.steerGenes.highestFitness * this.steerGenes.trials) + this.fitness)/(this.steerGenes.trials+1);
		//}
	}

	die(){

		this.steerGenes.trials ++;
		this.steerGenes.highestFitness = ((this.steerGenes.highestFitness * (this.steerGenes.trials-1)) + this.fitness)/(this.steerGenes.trials);

		this.fitness = 0;

		//this.steerGenes = new Genes(GENE_LENGTH);
		var N = Math.random();
		if(N < 0.7){
			this.steerGenes = genesList[Math.floor(Math.random() * 5)];
		}else if(N < 0.95){

			var p1 = Math.floor(Math.random() * 10);
			var p2 = Math.floor(Math.random() * 10);
			this.steerGenes = crossOver(genesList[p1], genesList[p2]);

		}else{
			this.steerGenes = new Genes(GENE_LENGTH);
			genesList.push(this.steerGenes);
		}
		this.generateGraphics();
	}

	generateGraphics(){
		this.triangle.clear();
		this.triangle.beginFill(Math.floor(0xff0000 * Math.random())); // replace with color from locality sensitive hash of gene
		this.triangle.lineStyle(0.5,0x000000,1);
		this.triangle.drawPolygon([
				-3,-2,
				-3, 2,
				3, 0,
				-3,-2
			]);
		this.triangle.endFill();
		this.triangle.x = this.transform.x;
		this.triangle.y = this.transform.y;
	}
}

export class GenSim{
	constructor(_containerId) {

		renderer = PIXI.autoDetectRenderer(400,300,{resolution:2});
		renderer.backgroundColor = 0xcccccc;

		var htmlContainer = document.getElementById(_containerId);

		htmlContainer.appendChild(renderer.view);

		stage = new PIXI.Container();

		this.boids = [];
		this.bigBoid = new BigBoid();

		var i:int = 80;
		while(i--){
			var s = new Boid(0,0);
			this.boids.push(s);
		}

		var overlay = document.createElement("DIV");
    	overlay.setAttribute("style", "position: relative; z-index: 999; height: 600px; width: 800px; margin: auto; margin-top: -600px;");
    	htmlContainer.appendChild(overlay);

		maxAccelSlider = makeSlider(0.01,0.5,0.025, "accel");
    	htmlContainer.appendChild(maxAccelSlider);

    	maxStearSlider = makeSlider(0.01, Math.PI/32, Math.PI/1280, "steer");
    	htmlContainer.appendChild(maxStearSlider);

    	simSpeedSlider = makeSlider(0, 20, 1,'step');
    	htmlContainer.appendChild(simSpeedSlider);
    	simSpeedSlider.slider.value = 1;

    	this.top=[];

    	i = 20;
    	while(i--){
    		var t = new PIXI.Text('', {font:"10px Arial", fill:"red"});
    		textList.push(t);

    		t.x = 0;
    		t.y = i*10;

    		stage.addChild(t);
    	}

		this.update();
	}

	update(){
		requestAnimationFrame(this.update.bind(this));

		MAX_ACCEL = parseFloat(maxAccelSlider.slider.value);
		MAX_STEER = parseFloat(maxStearSlider.slider.value);
		SIM_SPEED = parseFloat(simSpeedSlider.slider.value);

		debugger;

		var i = SIM_SPEED;

		var deathcount = 0;

		while(i--){

			var topID = 0;
			var m = -1;
			while(m++ <10){
				if(false){//if(genesList[m].trials > 30){
					topID = genesList[m].id;
					break;
				}
			}

			var j = this.boids.length;
			var xbar =0;
			var ybar =0;
			var vxbar = 0;
			var vybar = 0;
			while(j--){
				xbar+=this.boids[j].transform.x;
				ybar+=this.boids[j].transform.y;
				vxbar+=this.boids[j].transform.vx;
				vybar+=this.boids[j].transform.vy;
			}
			xbar/=this.boids.length;
			ybar/=this.boids.length;
			vxbar/=this.boids.length;
			vybar/=this.boids.length;
			this.boids.map((function(s){
				var input = 
					[
						s.transform.x / 400,
						s.transform.y / 300,
						s.transform.vx / 10,
						s.transform.vy / 10,
						s.transform.ax / MAX_ACCEL,
						s.transform.ay/ MAX_ACCEL,
						(s.transform.r % (Math.PI*2)) / (Math.PI*2),
						this.bigBoid.transform.vx / 10,
						this.bigBoid.transform.vy / 10,
						this.bigBoid.transform.x / 400,
						this.bigBoid.transform.y / 300,
						(s.transform.x - this.bigBoid.transform.x) / 400,
						(s.transform.y - this.bigBoid.transform.y) / 300,
						xbar / 400,
						ybar / 300,
						vxbar / 10,
						vybar / 10,
						(s.transform.x - xbar) / 400,
						(s.transform.y - ybar) / 300,
						(s.transform.vx - vxbar) / 10,
						(s.transform.vy - vybar) / 10
					];

					var steerctr = dotProduct(input, s.steerGenes.geneString);

					var steerval;
					//{
						steerval = steerctr;
					//}

				s.control(/*	(input, s.accelGenes)<0?0:*/MAX_ACCEL, steerval);

				s.update();

				// wrap them around
				wrap(s);

				//s.transform.x = clamp(s.transform.x, 0, 400);
				//s.transform.y = clamp(s.transform.y, 0, 300);

				s.triangle.scale.x = s.triangle.scale.y = 1;
				//if(this.genesList.length >= 5)
				{
					//var k = 1;
					//while(k--){
						if(s.steerGenes.id == topID){
							s.triangle.scale.x = s.triangle.scale.y = 2;
						}
					//}
				}

				if(s.transform.distance(this.bigBoid.transform) < s.radius + this.bigBoid.radius){
					//||s.transform.x<=0
					//||s.transform.x>=400
					//||s.transform.y<=0
					//||s.transform.y>=300){

					while(s.transform.distance(this.bigBoid.transform) < (s.radius + this.bigBoid.radius) * 2){
						s.transform.x = Math.random() * 400;
						s.transform.y = Math.random() * 300;
					}
					s.die();
					deathcount++
				}
			}).bind(this));

			this.bigBoid.update();
			wrap(this.bigBoid);

			genesList.sort(function(a,b){
				return  -a.highestFitness + b.highestFitness;
			});
		}

		this.top = genesList.slice(0,20);

		i =20;
		while(i--){
			//textList[i].text = ('id:' + this.top[i].id + " | " + (this.top[i].highestFitness/60).toFixed(2) + " secs");
		}

		renderer.render(stage);
	}
}