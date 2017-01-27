import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './blogpost.html';

class BlogPostCtrl{

	constructor($scope, $sce) {
		$scope.viewModel(this);		
		//this.content = $sce.trustAsHtml(this.post.content);
		this.title = this.post.title;
		this.content = $sce.trustAsHtml(this.post.content);
		this.temp = this.post.templateContent;
		this.date = this.post.date.toDateString();
	}
}

export default angular.module('blogpost',[angularMeteor]).component('blogpost',{
	templateUrl:'imports/components/blog/blogpost.html',
	controller: ['$scope', '$sce', BlogPostCtrl],
	bindings:{
		post:'='
	}
});