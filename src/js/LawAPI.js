const cdns = [
  'https://cdn.jsdelivr.net/gh/kong0107/mojLawSplitJSON@arranged/',
  'https://raw.githubusercontent.com/kong0107/mojLawSplitJSON/arranged/'
];

const getData = path =>
  Promise.race(
    cdns.map(cdn => fetch(cdn + path, {cache: 'no-cache'}))
  ).then(res => {
    if(res.ok) return res.json();
    else throw new ReferenceError(res.statusText);
  });
;

const promises = new Map();
promises.set('catalog', getData('index.json'));

const LawAPI = {
  loadCatalog: () => promises.get('catalog'),
  loadLaw: pcode => {
    let p = promises.get(pcode);
    if(!p) {
      p = getData(`FalVMingLing/${pcode}.json`);
      promises.set(pcode, p);
    }
    return p;
  }
};

export default LawAPI;
