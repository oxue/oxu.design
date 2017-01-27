import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import home from '../imports/components/home/home';
import gen from '../imports/components/gen/gen';
import about from '../imports/components/about/about';
import shooter from '../imports/components/shooter/shooter';
import art from '../imports/components/art/art';
import visitors from '../imports/components/visitors/visitors';


import '../imports/components/home/homeCtrl.js';
import '../imports/components/gen/genCtrl.js';

new WOW().init();

var app = angular.module('simple-todos', [
  angularMeteor,
  "ui.router",
  "visitors",
  "genCtrlModule",
  "homeCtrlModule"
]);

angular.module('simple-todos').config(["$stateProvider", function($stateProvider){
  var helloState = {
    name: 'home',
    url: '*path',
    templateUrl: 'imports/components/home/home.html',
    controller: 'HomeCtrl'
  }

  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: 'imports/components/about/about.html'
  }

  var shooterState = {
    name: 'shooter',
    url: '/shooter',
    templateUrl: 'imports/components/shooter/shooter.html'
  }

  var artState = {
    name: 'art',
    url: '/art',
    templateUrl: 'imports/components/art/art.html'
  }

  var genState = {
    name: 'gen',
    url: '/gen',
    templateUrl: 'imports/components/gen/gen.html',
    controller: 'GenCtrl'
  }

  $stateProvider.state(aboutState);
  $stateProvider.state(shooterState);
  $stateProvider.state(artState);
  $stateProvider.state(genState);
  $stateProvider.state(helloState);


}]);

