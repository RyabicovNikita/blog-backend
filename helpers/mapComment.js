module.exports = function (comment) {
  return {
    content: comment.content,
    author_login: comment.author.login,
    id: comment._id,
    published_at: comment.createdAt,
  };
};
