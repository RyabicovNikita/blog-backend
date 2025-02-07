const { Router } = require("express");

const router = Router({ mergeParams: true });

router.use("/", require("./auth-route"));
router.use("/posts", require("./post-route"));
router.use("/users", require("./user-route"));

module.exports = router;
