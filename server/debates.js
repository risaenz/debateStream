Meteor.publish("debates", function (options, searchString) {
  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    name: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or: [
      {
        $and: [
          {'public': true},
          {'public': {$exists: true}}
        ]
      },
      {
        $and: [
          {owner: this.userId},
          {owner: {$exists: true}}
        ]
      },
      {
        $and: [
          {invited: this.userId},
          {invited: {$exists: true}}
        ]
      }
    ]
  };

  Counts.publish(this, 'numberOfDebates', Debates.find(selector), {noReady: true});
  return Debates.find(selector, options);
});