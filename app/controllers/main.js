var db = require('../models');
var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment');

module.exports = function(app) {

  // Default route
  app.get('/', function(req, res) {

    db.Article
      .find({}, null, {sort: {dateScraped: -1}})
      .then(function(dbArticle) {
        res.render('index', { data: dbArticle});
      })
  })

  // When the 'Fetch Articles' button is clicked
  app.post('/', function(req, res) {

    request('https://news.ycombinator.com/', function(error, response, body) {
      if (error) throw error;

      var $ = cheerio.load(body);
      var today = moment().format("YYYY-MM-DD");

      $(".storylink").each(function(i, element) {

        if (i < 10) {
          var results = {
            "title": $(this).text(),
            "link": element.attribs.href,
            "dateScraped": today
          }

          db.Article
            .create(results)
            .then(function(dbArticle) {
              console.log("Saved article in Mongodb!");
            })
            .catch(function(err) {
              console.log("An error occurred attempting to save the article.")
            })
        }

      })
      res.redirect('back');
    })

  })

  // When the 'Delete Articles' button is clicked
  // TODO: Delete comments for the articles as well
  app.post('/delete', function(req, res) {

    console.log(req.body.id);

    if (req.body.id) {
      db.Article
        .remove({ _id: req.body.id })
        .then(function() {
          res.redirect('back')
        })
    } else {
      db.Article
        .remove({})
        .then(function() {
          res.redirect('back');
        })
    }

  })

}