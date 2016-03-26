angular.module('debateStream').directive('debateDetails', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/debates/debate-details/debate-details.html',
    controllerAs: 'debateDetails',
    controller: function ($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);
      
      this.subscribe('debates');
      this.subscribe('users');
 
      this.helpers({
        debate: () => {
          return Debates.findOne({_id: $stateParams.debateId});
        },
        users: () => {
          return Meteor.users.find({});
        }
      });
 
      this.save = () => {
        Debates.update({_id: $stateParams.debateId}, {
          $set: {
            name: this.debate.name,
            description: this.debate.description,
            'public': this.debate.public
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the debate...');
          }
          else {
            console.log('Done!');
          }
        });
      };
      
      this.invite = (user) => {
        Meteor.call('invite', this.debate._id, user._id, (error) => {
          if (error) {
            console.log('Oops, unable to invite!');
          }
          else {
            console.log('Invited!');
          }
        });
      };
    }
  }
});