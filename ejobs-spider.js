const Crawler = require('crawler'),
      fs = require('fs');

const data = [];
const jobDetail = [];

function extractItem($, id) {
  const datum = {id: id};
  if (!id) {
    return;
  }

  const container = $('#jobad-panel-description');

  container.find('.jobad-content-block').each(function() {
    const title = $(this).find('h2').text();
    const list = $(this).find('ul');
    const listContent = [];
  
    list.find('li').each(function() {
      listContent.push($(this).text());
    });
    if(!title) return;

    if (title.includes('Candidatul ideal')) {
      datum.requirments = listContent;
    } else if(title.includes('Descrierea jobului')) {
      datum.description = listContent;
    } else if(title.includes('Descrierea companiei')) {
      datum.companyDescription = $(this).find(' p:nth-child(2)').text();
    }
  });

  console.log(datum);
  jobDetail.push(datum);
}

const itemCrawler = new Crawler({
  rateLimit: 100,
  maxConnections: 6,
  callback: (error, res, done) => {
    if(error) {
      console.log(error)
    } else {
      extractItem(res.$, res.request.uri.path.split('/').pop());
    }

    done();
  }
});

function extractList($) {
  const list = $('#job-app-list');

  list.find('li').each(function() {
    const body = $(this).find('.jobitem-body');
    
    if (body.length) {
      const datum = {
        title: body.find('h3 > a').text(),
        link: body.find('h3 > a').attr('href'),
        company: body.find('h4 > a').text(),
        industry: $(this).data('dlindustries'),
        level: $(this).data('dlcareerlevels'),
        location: 'Iasi',
        website: 'ejobs',
        webSiteId: $(this).data('id')
      };

      data.push(datum);
      itemCrawler.queue(datum.link);
    }
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
  'https://www.ejobs.ro/locuri-de-munca/iasi/it---telecom/page1/',
  'https://www.ejobs.ro/locuri-de-munca/iasi/it---telecom/page2/',
  'https://www.ejobs.ro/locuri-de-munca/iasi/it---telecom/page3/'
].forEach(link => listCrawler.queue(link));


function onListFinish() {
  return new Promise((resolve) => {
    listCrawler.on('drain', () => {
      resolve();
    });
  });
}

function onItemsFinish() {
  return new Promise((resolve) => {
    itemCrawler.on('drain', () => {
      resolve();
    });
  });
}

async function flush() {
  await onListFinish();
  await onItemsFinish();

  data.forEach(datum => {
    const { webSiteId } = datum;
    datum.jobDetails = jobDetail.find(detail => detail.id.toString() === webSiteId.toString());
  });
  
  console.dir(data);

  fs.writeFile('./data/ejobs.json', JSON.stringify(data, true, ' '), (err) => {
    if (err) throw err;
  });

  fs.writeFile('./data/ejobsdetails.json', JSON.stringify(jobDetail, true, ' '), (err) => {
    if (err) throw err;
  });
}

flush();