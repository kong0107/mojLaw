import {
  fetch2,
  getFirstFulfilled
} from './utility';

const cdns = [
  'https://cdn.jsdelivr.net/gh/kong0107/mojLawSplitJSON@arranged/',
  'https://raw.githubusercontent.com/kong0107/mojLawSplitJSON/arranged/'
];

/**
 * 同時跟各個 CDN 要資料，只解析第一個成功的。
 */
const getData = path =>
  getFirstFulfilled(
    cdns.map(cdn => fetch2(cdn + path, {cache: 'no-cache'}))
  ).then(res => res.json())
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
