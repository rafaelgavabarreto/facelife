"use strict";

const express = require('express');
const AWS     = require('aws-sdk');
const router  = express.Router();
const cookieSession = require("cookie-session");

// const bodyParser = require('body-parser'),
// const multer = require('multer'),
// const multerS3 = require('multer-s3');

router.use(cookieSession({
  name: 'session',
  secret: "mylittlesecret",
  maxAge: 24
}));

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

function s3Upload(folder,image) {
  folder = (folder + "/");
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: (folder + image),
    ACL: 'public-read',
    Body: image
  };
  console.log("Folder name: " + folder + "bucket" + process.env.S3_BUCKET);
  console.log("File: " + image);
  
  s3.putObject(params, function (err, data) {
    err ? console.log("Error: ",err) : console.log("Successfully uploaded data",data)
  });
  // console.log(s3.getSignedUrl('getObject', {Key: params.Key}))
}


module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("post")
      .then((results) => {
        res.json(results);
        // res.render("index",results);
    });
    res.render("index");
    // return
  });

  router.get("/:category_id", (req, res) => {
    knex
      .select("*")
      .from("post")
      .where('category_id', '=', req.params.category_id)
      .then((results) => {
        res.json(results);
      })
      .catch(error => console.error(error)
    );
  });

  router.get("/:category_id/:post_id", (req, res) => {
    knex
      .select("*")
      .from("post")
      .where('id', '=', req.params.post_id)
      .where('category_id', '=', req.params.category_id)
      .then((results) => {
        res.json(results);
    })
    .catch(error => console.error(error)
    );
    return res.render("index");
  });

  router.post("/post", (req, res) => {
    // console.log(s3Upload('1',req.session.preview_picture));
    // s3.putObject({Key: albumKey}, function(err, data) {} );
    knex('post')
      .returning('id')
      .insert([{
        Title: req.session.Title,
        Article: req.session.Article
      }])
      .then(function (id) {
        console.log(req.session)
        s3Upload(id,req.session.preview_picture)
        // s3.putObject({Key: req.session.preview_picture}, function(err, data) {} );
        knex('post')
          .where('id', '=', id)
          .update({
            preview_picture: s3Upload(id,req.session.preview_picture),
            header_picture: s3Upload(id,req.session.header_picture),
            Footer_picture: s3Upload(id,req.session.Footer_picture),
            Footer_image_tagnote: s3Upload(id,req.session.Footer_image_tagnote),
            Meta_data: s3Upload(id,req.session.Meta_data)
          })
      })
      .catch(error => console.error(error)
    );
    return res.render("index");
  });

  return router;
}