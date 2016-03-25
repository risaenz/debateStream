angular.module('stream').directive('addNewDebateModal', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/debates/add-new-debate-modal/add-new-debate-modal.html',
    controllerAs: 'addNewDebateModal',
    controller: function ($scope, $stateParams, $reactive, $mdDialog) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        }
      });

      this.newDebate = {};

      this.addNewDebate = () => {
        this.newDebate.owner = Meteor.userId();
        Debates.insert(this.newDebate);
        this.newDebate = {};
        $mdDialog.hide();
      };

      this.close = () => {
        $mdDialog.hide();
      }
    }
  }
});