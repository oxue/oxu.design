import angular from 'angular';
import angularMeteor from 'angular-meteor';
import blogpost from '../blog/blogpost';
import temp1 from '../blog/temp1';



import {GenSim} from "./GenSim.js";

export default angular.module('genCtrlModule',[angularMeteor, 'blogpost']).controller('GenCtrl',['$scope', function($scope){
	$scope.viewModel(this);
	$scope.init = function(){
		console.log("gen");

		new GenSim("sim-container");
	};

	$scope.genBlogPost={
		title:"Progress on predator evasion AI that uses Support Vector Machine",
		templateContent:"imports/components/blog/temp1.html",
		date:new Date(2017,1,27)
	};


	$scope.init();
}]);