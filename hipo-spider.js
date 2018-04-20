const Crawler = require('crawler'),
      fs = require('fs');

const data = [];

function extractList($) {
  const body = $('.tbl-hipo.tbl-results tbody');

  body.find('tr').each(function() {
    if($(this).length === 0) return;
    const info = $(this).find('.cell-info');
    const company = $(this).find('.cell-company');

    const datum = {
      title: info.find('a').attr('title'),
      time: info.find('p:first-child span.badge').text(),
      level: info.find('p:first-child span.text').text(),
      link: info.find('a').attr('href'),
      company: company.find('a span').text(),
      date: $(this).find('.cell-date span').text(),
      location: 'Iasi',
      website: 'hipo'
    };

    data.push(datum);
  });
}

const listCrawler = new Crawler({
  rateLimit: 500,
  maxConnections: 1,
  callback: (error, res, done) => {
    if(error) {
      console.log(error)
    } else {
      extractList(res.$);
    }

    done();
  }
});

[
  'https://www.hipo.ro/locuri-de-munca/cautajob/IT-Software/Iasi/',
  'https://www.hipo.ro/locuri-de-munca/cautajob/IT-Software/Iasi/2',
  'https://www.hipo.ro/locuri-de-munca/cautajob/IT-Software/Iasi/3'
].forEach(link => listCrawler.queue(link));


function onListFinish() {
  return new Promise((resolve) => {
    listCrawler.on('drain', () => {
      resolve();
    });
  });
}

async function flush() {
  await onListFinish();

  fs.writeFile('./data/hipo.json', JSON.stringify(data, true, ' '), (err) => {
    if (err) throw err;
  });

}

flush();