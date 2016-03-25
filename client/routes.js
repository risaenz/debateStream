angular.module('stream')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('debates', {
        url: '/debates',
        template: '<debates-list></debates-list>'
      })
      .state('debateDetails', {
        url: '/debates/:debateId',
        template: '<debate-details></debate-details>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            }
            else {
              return $q.resolve();
            }
          }
        }
      })
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('resetpw', {
        url: '/resetpw',
        template: '<resetpw></resetpw>'
      });

    $urlRouterProvider.otherwise("/debates");
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('debates');
      }
    });
  });