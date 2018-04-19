const Spider = require('./spider');

const ejobsSpider = new Spider({
  url: 'https://www.ejobs.ro/locuri-de-munca/iasi/it---telecom/',
  website: 'ejobs'
});

ejobsSpider.bindExtractList(($) => {
  const list = $('#job-app-list');

  list.find('li').each(function() {
    const body = $(this).find('.jobitem-body');
    if(body.length) {
      const datum = {
        title: body.find('h3 > a').text(),
        link: body.find('h3 > a').attr('href'),
        company: body.find('h4 > a').text(),
        industry: $(this).data('dlindustries'),
        level: $(this).data('dlcareerlevels'),
        location: 'Iasi',
        website: ejobsSpider.website
      };
      console.log(datum);
      ejobsSpider.appendDatum(datum);
    }
  });
});

ejobsSpider.start();