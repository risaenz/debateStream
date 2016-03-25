Meteor.startup(function () {
  if (Debates.find().count() === 0) {
    var debates = [
      {
        'name': 'NDT Finals',
        'description': 'Fast just got faster with Nexus S.'
      },
      {
        'name': 'CEDA Finals',
        'description': 'Get it on!'
      },
      {
        'name': 'ADA Finals',
        'description': 'Leisure suit required. And only fiercest manners.'
      }
    ];

    for (var i = 0; i < debates.length; i++) {
      Debates.insert(debates[i]);
    }
  }
});
