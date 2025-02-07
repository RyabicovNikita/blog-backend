const { Router } = require("express");
const {
  getPost,
  getPosts,
  addPost,
  editPost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/post-controller");
const mapPost = require("../helpers/mapPost");
const auth = require("../middlewares/auth");
const { addComment, deleteComment } = require("../controllers/comment-controller");
const mapComment = require("../helpers/mapComment");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const { posts, lastPage } = await getPosts(req.query.search, req.query.limit, req.query.page);
  res.send({ body: { lastPage, posts: posts.map((post) => mapPost(post)) } });
});

router.get("/:id", async (req, res) => {
  const post = await getPost(req.params.id);
  res.send({ body: mapPost(post) });
});

router.post("/", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  const newPost = await addPost({
    title: req.body.title,
    content: req.body.content,
    image_url: req.body.image_url,
  });
  res.send({ body: mapPost(newPost) });
});

router.patch("/:id/like", auth, async (req, res) => {
  const updatedPost = await likePost(req.params.id, req.body.userId);
  res.send({ body: mapPost(updatedPost) });
});

router.delete("/:id/like", auth, async (req, res) => {
  const updatedPost = await unlikePost(req.params.id, req.body.likeId);
  res.send({ body: mapPost(updatedPost) });
});

router.patch("/:id", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  const updatedPost = await editPost(req.params.id, {
    title: req.body.title,
    content: req.body.content,
    image_url: req.body.image_url,
  });
  res.send({ body: mapPost(updatedPost) });
});

router.delete("/:id", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  await deletePost(req.params.id);

  res.send({});
});

router.post("/:id/comments", auth, async (req, res) => {
  const newComment = await addComment(req.params.id, {
    content: req.body.content,
    //Автор здесь появляется из middleware = auth
    author: req.user.id,
  });

  res.send({ body: mapComment(newComment) });
});

router.delete("/:postId/comments/:commentId", auth, hasRole(ROLES.ADMIN, ROLES.MODERATOR), async (req, res) => {
  await deleteComment(req.params.postId, req.params.commentId);
  res.send({});
});

module.exports = router;
