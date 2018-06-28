const fs = require('fs');

function getFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./title_company.csv', 'utf-8' ,(err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

function writeFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./${file}`, data, (err) => {
      if(err) {
        return reject(err);
      }

      resolve();
    })
  });
}

function parseLines(file) {
  const lines = file.split('\n');
  const ids = [];
  companies = {};

  lines.forEach(line => {
    const items = line.split(',');
    const id = items[0];
    const title = items[1];
    const company = items[3];
    if(!companies[company]) {
      companies[company] = [];
    }

    companies[company].push(title);
  });
  const nodes = [];
  const edges = [];
  let id = 0;
  for (let key in companies) {
    const companyId = id;
    nodes.push({id: companyId, label: key});
    companies[key].forEach(job => {
      const jobId = ++id;
      nodes.push({id: jobId, label: job});
      edges.push({source: companyId, target: jobId});
    });
    id++;
  }


  return {
    nodes, edges
  }
}

async function main() {
  try {
    const file = await getFile();
    const {nodes, edges} = parseLines(file);

    const nodesData = nodes.map(node => `${node.id}, ${node.label}`).join('\n');
    await writeFile('nodes.csv', nodesData);

    const edgesData = edges.map(edge => `${edge.source}, ${edge.target}`).join('\n');
    await writeFile('edges.csv', edgesData);
  } catch(error) {
    console.log(error);
  }
}

main();