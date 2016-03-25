Debates = new Mongo.Collection("debates");

Debates.allow({
  insert: function (userId, debate) {
    return userId && debate.owner === userId;
  },
  update: function (userId, debate, fields, modifier) {
    return userId && debate.owner === userId;
  },
  remove: function (userId, debate) {
    return userId && debate.owner === userId;
  }
});

let getContactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
};

Meteor.methods({
  invite: function (partyId, userId) {
    check(debateId, String);
    check(userId, String);

    let debate = Debates.findOne(debateId);

    if (!debate)
      throw new Meteor.Error(404, "No such debate!");

    if (debate.owner !== this.userId)
      throw new Meteor.Error(404, "No permissions!");

    if (debate.public)
      throw new Meteor.Error(400, "That debate is public. No need to invite people.")


    if (userId !== debate.owner && !_.contains(debate.invited, userId)) {
      Debates.update(debateId, {$addToSet: {invited: userId}});

      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        Email.send({
          from: "noreply@stream.com",
          to: to,
          replyTo: from || undefined,
          subject: "DEBATE: " + debate.title,
          text: "Hey, I just invited you to '" + debate.title + "' on Stream." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },

  upvote: function (debateId, vote) {
    check(debateId, String);
    check(vote, String);

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to vote");

    if (!_.contains(['upvote', 'downvote', 'view'], rsvp))
      throw new Meteor.Error(400, "Invalid vote");

    let debate = Debates.findOne(debateId);

    if (!debate)
      throw new Meteor.Error(404, "No such debate");

    if (!debate.public && debate.owner !== this.userId && !_.contains(debate.invited, this.userId))
      throw new Meteor.Error(403, "No such debate"); // its private, but let's not tell this to the user

    let voteIndex = _.indexOf(_.pluck(debate.votes, 'user'), this.userId);

    if (voteIndex !== -1) {
      // update existing rsvp entry
      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Debates.update(
          {_id: debateId, "votes.user": this.userId},
          {$set: {"votes.$.vote": vote}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        let modifier = {$set: {}};
        modifier.$set["votes." + voteIndex + ".vote"] = vote;

        Debates.update(debateId, modifier);
      }
    } else {
      // add new rsvp entry
      Debates.update(debateId,
        {$push: {votes: {user: this.userId, vote: vote}}});
    }
  }
});