angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.denuncia', {
    url: '/page2',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/denuncia.html',
        controller: 'denunciaCtrl'
      }
    }
  })

  .state('tabsController.localizacao', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/localizacao.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tabsController.solicitação', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/solicitação.html',
        
      }
    }
  })

.state('tabsController.sobrenos', {
    url: '/pageconfig',
    views: {
      'tab4': {
        templateUrl: 'templates/sobrenos.html',
        
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true,    
  })

  .state('home', {
    url: '/page5',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })


$urlRouterProvider.otherwise('/page5')

});