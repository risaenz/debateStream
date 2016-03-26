angular.module('debateStream').directive('debatesList', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/debates/debates-list/debates-list.html',
        controllerAs: 'debatesList',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            this.newParty = {};
            this.perPage = 3;
            this.page = 1;
            this.sort = {
                name: 1
            };
            this.orderProperty = '1';
            this.searchText = '';

            this.helpers({
                debates: () => {
                    return Debates.find({}, { sort: this.getReactively('sort') });
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
                Meteor.call('vote', debateId, vote, (error) => {
                    if (error) {
                        console.log('Oops, unable to vote!');
                    }
                    else {
                        console.log('Vote Done!');
                    }
                });
            };

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

            this.addDebate = () => {
                this.newDebate.owner = Meteor.user()._id;
                Debates.insert(this.newDebate);
                this.newDebate = {};
            };

            this.removeDebate = (debate) => {
                Debates.remove({ _id: debate._id });
            };

            this.pageChanged = (newPage) => {
                this.page = newPage;
            };
        }
    }
});