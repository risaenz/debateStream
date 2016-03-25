angular.module('stream').directive('stream', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/stream/stream.html',
    controllerAs: 'stream',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUser: () => {
          return Meteor.user();
        }
      });

      this.logout = () => {
        Accounts.logout();
      }
    }
  }
});