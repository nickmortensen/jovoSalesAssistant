/* eslint-disable object-curly-newline */
/**
 * Google Cloud Function that responds to messages sent from a
 * Hangouts Chat room.
 *
 * @param {Object} req Request sent from Hangouts Chat room
 * @param {Object} res Response to send back
 */
exports.helloHangoutsChat = function helloHangoutsChat(req, res) {
  const sender = req.body.message.sender.displayName;
  const image  = req.body.message.sender.avatarUrl;
  const data   = createMessage(sender, image);

  res.send(data);
};

/**
 * Creates a card with two widgets.
 * @param displayName the sender's display name
 * @param imageURL the URL for the sender's avatar
 */
function createMessage(displayName, imageURL) {
  const HEADER              = { title: `Hello ${displayName}!` };
  const SENDER_IMAGE_WIDGET = { imageUrl: imageURL };

  return {
    cards: [{
      header: HEADER,
      sections: [{
        widgets: [{
          textParagraph: {
            text: 'Your avatar picture:',
          },
        }, {
          image: SENDER_IMAGE_WIDGET,
        }],
      }],
    }],
  };
}
