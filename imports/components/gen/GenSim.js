import * as PIXI from 'pixi.js';

import {Transform} from './Transform.js';

var stage = null;
var renderer = null;

var MAX_ACCEL = 1;
var MAX_STEER = Math.PI/32;
var GLOBAL_DAMP = 0.95;

var maxAccelSlider;
var maxStearSlider;

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

class BigBoid{
	constructor(_x = 100, _y = 100, _radius = 30) {
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

		this.transform.ax = diffx/lenDiff * MAX_ACCEL
		this.transform.ay = diffy/lenDiff * MAX_ACCEL

		this.transform.update();

		var velLen = Math.sqrt(this.transform.vx * this.transform.vx + this.transform.vy * this.transform.vy);

		if(lenDiff<=velLen){
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
	constructor(_x = 100, _y = 100) {
		this.transform = new Transform(_x, _y);
		this.transform.setDamping(GLOBAL_DAMP);
		this.triangle = new PIXI.Graphics();
		this.generateGraphics();
		stage.addChild(this.triangle);

		this.radius = 3;
	}

	control(_accel, _steer){
		_accel = clamp(_accel, 0, MAX_ACCEL);
		_steer = clamp(_steer, -MAX_STEER, MAX_STEER);

		this.transform.ax = Math.cos(this.transform.r) * _accel;
		this.transform.ay = Math.sin(this.transform.r) * _accel;
		this.transform.ar = _steer;
	}

	update(){
		this.control(Math.random() * 4 - 2, Math.random() * 4 - 2);

		this.transform.update();
		
		this.triangle.x = this.transform.x;
		this.triangle.y = this.transform.y;
		this.triangle.rotation = this.transform.r;
	}

	die(){
		this.transform.x = Math.random() * 400;
		this.transform.y = Math.random() * 300;
		this.generateGraphics();
	}

	generateGraphics(){
		this.triangle.clear();
		this.triangle.beginFill(Math.floor(0xff0000 * Math.random())); // replace with color from hash of gene
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

		var i:int = 20;
		while(i--){
			var s = new Boid();
			this.boids.push(s);
		}

		var overlay = document.createElement("DIV");
    	overlay.setAttribute("style", "position: relative; z-index: 999; height: 600px; width: 800px; margin: auto; margin-top: -600px;");
    	htmlContainer.appendChild(overlay);

		maxAccelSlider = makeSlider(0,0.5,0.025, "accel");
    	htmlContainer.appendChild(maxAccelSlider);

    	maxStearSlider = makeSlider(0, Math.PI/64, Math.PI/320, "steer");
    	htmlContainer.appendChild(maxStearSlider);

		this.update();
	}

	update(){
		requestAnimationFrame(this.update.bind(this));

		MAX_ACCEL = maxAccelSlider.slider.value;
		MAX_STEER = maxStearSlider.slider.value;

		this.boids.map((function(s){
			s.update();
			// wrap them around
			wrap(s);

			//console.log(s.transform.distance(this.bigBoid.transform));

			if(s.transform.distance(this.bigBoid.transform) < s.radius + this.bigBoid.radius){
				s.die();
			}
		}).bind(this));

		this.bigBoid.update();
		wrap(this.bigBoid);



		renderer.render(stage);
	}
}