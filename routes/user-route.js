const { Router } = require("express");
const { updateUser, deleteUser, getRoles, getUsers } = require("../controllers/user-controller");
const hasRole = require("../middlewares/hasRole");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");
const auth = require("../middlewares/auth");

const router = Router({ mergeParams: true });

router.get("/", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  try {
    const users = await getUsers();
    const roles = await getRoles();
    res.send({ body: { users: users.map((user) => mapUser(user)), roles } });
  } catch (e) {
    res.send({ error: e.message });
    return;
  }
});

router.patch("/:id", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  const newUser = await updateUser(req.params.id, {
    role: req.body.role_id,
  });
  res.send({ body: mapUser(newUser) });
});

router.delete("/:id", auth, hasRole(ROLES.ADMIN), async (req, res) => {
  await deleteUser(req.params.id);
  res.send({});
});

module.exports = router;
