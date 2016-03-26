angular.module('debateStream').filter('uninvited', function () {
  return function (users, debate) {
    if (!debate) {
      return false;
    }
 
    return _.filter(users, function (user) {
      return !(user._id == debate.owner || _.contains(debate.invited, user._id));
    });
  }
});