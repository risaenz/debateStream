angular.module('stream').directive('debatesList', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/debates/debates-list/debates-list.html',
    controllerAs: 'debatesList',
    controller: function ($scope, $reactive, $mdDialog) {
      $reactive(this).attach($scope);

      this.perPage = 5;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.orderProperty = '1';
      this.searchText = '';

      this.helpers({
        debates: () => {
          return Debates.find({}, { sort : this.getReactively('sort') });
        },
        users: () => {
          return Meteor.users.find({});
        },
        debatesCount: () => {
          return Counts.get('numberOfDebates');
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
        options: {
          maxZoom: 10,
          styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
          }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
          }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
          }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
          }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
          }]
        },
        zoom: 8
      }; */

      this.subscribe('users');

      this.subscribe('debates', () => {
        return [
          {
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.removeDebate = (debate) => {
        Debates.remove({_id: party._id});
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.sort = {
          name: parseInt(this.orderProperty)
        }
      };

      this.getDebateCreator = function (debate) {
        if (!debate) {
          return '';
        }

        let owner = Meteor.users.findOne(debate.owner);

        if (!owner) {
          return 'nobody';
        }

        if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
          return 'me';
        }

        return owner;
      };

      this.vote = (debateId, vote) => {
        Meteor.call('vote', partyId, rsvp, (error) => {
          if (error) {
            console.log('Oops, unable to vote!');
          }
          else {
            console.log('Vote Done!');
          }
        });
      };

      this.getUserById = (userId) => {
        return Meteor.users.findOne(userId);
      };

      this.outstandingInvitations = (party) => {
        return _.filter(this.users, (user) => {
          return (_.contains(debate.invited, user._id) && !_.findWhere(debate.votes, {user: user._id}));
        });
      };

      this.openAddNewDebateModal = function () {
        $mdDialog.show({
          template: '<add-new-debate-modal></add-new-debate-modal>',
          clickOutsideToClose: true
        });
      };

      this.isVote = (vote, debate) => {
        if (Meteor.userId() == null) {
          return false;
        }

        let voteIndex = party.myVoteIndex;
        voteIndex = voteIndex || _.indexOf(_.pluck(debate.votes, 'user'), Meteor.userId());

        if (voteIndex !== -1) {
          debate.myVoteIndex = voteIndex;
          return debate.votes[voteIndex].vote === vote;
        }
      }
    }
  }
});