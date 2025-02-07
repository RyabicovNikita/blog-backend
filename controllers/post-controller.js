const Post = require("../models/Post");
async function addPost(post) {
  const newPost = await Post.create(post);
  await newPost.populate({
    path: "comments",
    populate: "author",
  });
  return newPost;
}

async function likePost(postId, userId) {
  const editPost = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }, { returnDocument: "after" });

  await editPost.populate({
    path: "comments",
    populate: "author",
  });
  return editPost;
}

function unlikePost(postId, userId) {
  return Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { returnDocument: "after" });
}

async function editPost(id, post) {
  const newPost = await Post.findByIdAndUpdate(id, post, { returnDocument: "after" });
  await newPost.populate({
    path: "comments",
    populate: "author",
  });
  return newPost;
}

function deletePost(id) {
  return Post.deleteOne({ _id: id });
}

async function getPosts(search = "", limit = 10, page = 1) {
  const [posts, count] = await Promise.all([
    Post.find({ title: { $regex: search, $options: "i" } })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    Post.countDocuments({ title: { $regex: search, $options: "i" } }),
  ]);
  return { posts, lastPage: Math.ceil(count / limit) || 1 };
}

function getPost(id) {
  return Post.findById(id).populate({
    path: "comments",
    populate: "author",
  });
}

module.exports = {
  addPost,
  deletePost,
  getPosts,
  editPost,
  getPost,
  likePost,
  unlikePost,
};
