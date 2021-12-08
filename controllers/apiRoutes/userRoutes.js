const express = require('express')
// const router = express.Router();
const router = require('express').Router();
const {User} = require("../../models")
// const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    User.findAll()
      .then(UserData => {
        res.json(UserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ err });
      });
  });
  
  // router.get("/logout", (req, res) => {
  //   req.session.destroy(() => {
  //     res.json({ msg: "session destroyed!" });
  //   });
  // });
  
  // router.get("/:id", (req, res) => {
  //   User.findOne(req.params.id)
  //     .then(singleUser => {
  //       if (singleUser) {
  //         res.json(singleUser);
  //       } else {
  //         res.status(404).json({ err: "no such user found!" });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json({ err });
  //     });
  // });
  
  router.post("/", async(req, res) => {
   
      try {
        const newUser = await User.create({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password
        });
    
        req.session.save(() => {
          req.session.id = newUser.id;
          req.session.email = newUser.email;
          req.session.username = newUser.username;
          req.session.loggedIn = true;
    
          res.json(newUser);
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });
  
    router.post('/login', async (req, res) => {
      try {
        const user = await User.findOne({
          where: {
            username: req.body.username,
          },
        });
    
        if (!user) {
          res.status(400).json({ message: 'No user account found!' });
          return;
        }
    
        const validPassword = user.checkPassword(req.body.password);
    
        if (!validPassword) {
          res.status(400).json({ message: 'No user account found!' });
          return;
        }
    
        req.session.save(() => {
          req.session.userId = user.id;
          req.session.username = user.username;
          req.session.loggedIn = true;
    
          res.json({ user, message: 'You are now logged in!' });
        });
      } catch (err) {
        res.status(400).json({ message: 'No user account found!' });
      }
    });

    router.post('/logout', (req, res) => {
      if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      } else {
        res.status(404).end();
      }
    });
  
  router.put("/:id", (req, res) => {
    User.update(
      {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(updatedData => {
        if (updatedData[0]) {
          res.json(updatedData);
        } else {
          res.status(404).json({ err: "no such user found!" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ err });
      });
  });
  
  router.delete("/:id", (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(deletedUser => {
        if (deletedUser) {
          res.json(deletedUser);
        } else {
          res.status(404).json({ err: "no such user found!" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ err });
      });
  });
  
  module.exports = router;