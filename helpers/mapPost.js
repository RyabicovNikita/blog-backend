const mongoose = require("mongoose");
const mapComment = require("./mapComment");

module.exports = function (post) {
  return {
    id: post.id,
    title: post.title,
    image_url: post.image_url,
    content: post.content,
    comments: post.comments.map((comment) => (mongoose.isObjectIdOrHexString(comment) ? comment : mapComment(comment))),
    published_at: post.createdAt,
    likes: post.likes,
  };
};
