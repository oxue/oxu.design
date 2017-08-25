import angular from 'angular';
import angularMeteor from 'angular-meteor';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import Summary from '../../ui/summary.jsx';

class Particle{
	constructor(x, y, r, max) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.age = 0;
		this.max = max;
	}
}

export default angular.module('homeCtrlModule',[angularMeteor]).controller('HomeCtrl',['$scope', function($scope){
	var inter = null;

	$scope.init = function(){

		//render(<Summary />, document.querySelector('.summary-target'));

		console.log("Hello");

		var elem = document.querySelector('.grid');
		var msnry = new Masonry( elem, {
			// options
			itemSelector: '.grid-item',
			gutter:40,
			isFitWidth : true
		});

		ctx = document.getElementById("anim-background").getContext("2d");
		var particles = [];
		var birthrate = 2;
		var birthtime = 30/birthrate;
		var birthtimer = 0;

		inter = setInterval(function(){

			ctx.clearRect(0,0,400,200);

			//birth
			birthtimer ++;
			if(birthtimer >= birthtime){
				birthtimer = 0;
				var pa = new Particle(
					Math.random() * 380 + 10, 
					Math.random() * 180 + 10,
					Math.random() * 3 + 3,
					Math.random() * 30 + 120);
				particles.push(pa);
			}

			var i = particles.length;
			while(i--){
				var p = particles[i];

				if(p.age>p.max){
					particles.splice(i,1);
					continue;
				}

				p.age++;
				ctx.beginPath();
		    	ctx.arc(p.x, p.y, p.r * 0.5 + (p.age/p.max), 0, 2 * Math.PI, false);
		    	if(p.age < p.max/2){
		    		ctx.fillStyle = "rgba(255,255,255,"+ 0.6*p.age/p.max +")";
		    	}else{
		    		ctx.fillStyle = "rgba(255,255,255,"+ 0.6*(1-p.age/p.max) +")";
		    	}
		    	ctx.fill();
		    	ctx.lineWidth = 0;
		    	ctx.strokeStyle = "rgba(0,0,0,0)";
		    	ctx.stroke();
			}

		},33);
	};

	$scope.$on('$destroy', function(){
		clearInterval(inter);
		console.log("Bye");
	});

	$scope.init();
}]);