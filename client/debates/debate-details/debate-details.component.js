angular.module('stream').directive('debateDetails', function () {
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
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUserId: () => {
          return Meteor.userId();
        }
      });

      /*this.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          click: (mapModel, eventName, originalEventArgs) => {
            if (!this.party)
              return;

            if (!this.party.location)
              this.party.location = {};

            this.party.location.latitude = originalEventArgs[0].latLng.lat();
            this.party.location.longitude = originalEventArgs[0].latLng.lng();

            //scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          }
        },
        marker: {
          options: { draggable: true },
          events: {
            dragend: (marker, eventName, args) => {
              if (!this.party.location)
                this.party.location = {};

              this.party.location.latitude = marker.getPosition().lat();
              this.party.location.longitude = marker.getPosition().lng();
            }
          }
        }
      }; */

      this.save = () => {
        Debates.update({_id: $stateParams.debateId}, {
          $set: {
            name: this.debate.name,
            description: this.debate.description,
            'public': this.debate.public,
            //location: this.party.location
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

      this.canInvite = () => {
        if (!this.debate)
          return false;

        return !this.debate.public && this.debate.owner === Meteor.userId();
      };
    }
  }
});