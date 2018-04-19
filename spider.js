const Crawler = require('crawler'),
      fs = require('fs');

class Spider {

  constructor({ url, website }) {
    this.inList = true;
    this.initCrawler();
    this.data = [];

    this.url = url;
    this.website = website;
  }

  bindExtractList(callback) {
    this.extractListCallback = callback;
  }

  appendDatum(datum) {
    this.data.push(datum);
  }

  extractList($) {
    console.log($);
    this.extractListCallback($);
    this.inList = false;
  }

  initCrawler() {
    this.crawler = new Crawler({
      rateLimit: 500,
      maxConnections: 1,
      callback: (error, res, done) => {
        if(error) {
          console.log(error)
        } else {
          if (this.inList) {
            this.extractList(res.$);
          }
        }

        this.flush();
        done();
      }
    });
  }

  flush() {
    fs.writeFile(`./data/${this.website}.json`, JSON.stringify(this.data, true, ' '), (err) => {
      if (err) throw err;
    });
  }

  start() {
    this.crawler.queue(this.url);
  }

}

module.exports = Spider;