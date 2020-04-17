const express = require("express");

const posts = require("../posts/postDb");
const users = require("./userDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  users
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error adding user",
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  posts
    .insert({ ...req.body, user_id: req.params.id })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => next(err));
});

router.get("/", (req, res) => {
  users
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error getting users",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  users
    .getUserPosts(req.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => next(err));
});

router.delete("/:id", validateUserId, (req, res, next) => {
  users
    .remove(req.params.id)
    .then((count) => {
      res.status(200).json({
        message: "user has been nuked",
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  users
    .update(req.id, req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

//custom middleware

function validateUserId(req, res, next) {
  users
    .getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user;
        req.id = req.params.id;
        next();
      } else {
        next(err);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Could not get user",
      });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing body",
    });
  }
  if (!req.body.name) {
    res.status(400).json({
      message: "missing name",
    });
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing body",
    });
  }
  if (!req.body.text) {
    res.status(400).json({
      message: "missing text",
    });
  }
  next();
}

module.exports = router;
