import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './visitors.html';

class VisitorsCtrl{

	constructor($scope) {
		$scope.viewModel(this);

		this.helpers({
			items(){

				return "Visitors : " + VisitTracker.visits.find().count();
				
			}
		});
		

	}
}

export default angular.module('visitors',[angularMeteor]).component('visitors',{
	templateUrl:'imports/components/visitors/visitors.html',
	controller: ['$scope', VisitorsCtrl]
});