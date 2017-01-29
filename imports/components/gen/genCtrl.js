import angular from 'angular';
import angularMeteor from 'angular-meteor';
import blogpost from '../blog/blogpost';
import temp1 from '../blog/temp1';



import {GenSim} from "./GenSim.js";

var gensim = {};

export default angular.module('genCtrlModule',[angularMeteor, 'blogpost']).controller('GenCtrl',['$scope', function($scope){
	$scope.viewModel(this);
	$scope.init = function(){
		console.log("gen");

		MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
		setTimeout(function() {
	    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	  });
		$scope.gensim = new GenSim("sim-container");
	};
	$scope.genBlogPost={
		title:"Progress on predator evasion AI that uses Support Vector Machine",
		templateContent:"imports/components/blog/temp1.html",
		date:new Date(2017,0,27)
	};


	$scope.init();
}]);