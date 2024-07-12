import { browser } from 'k6/experimental/browser';
import { check, sleep, group, } from 'k6';
// import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { Counter } from 'k6/metrics';
import http from 'k6/http';
import exec from 'k6/execution';

// export function handleSummary(data) {
//   return {
//     "reports/summary.html": htmlReport(data),
//   };
// }
export const options = {

  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds:{
    http_req_duration: ['p(95)<350'],
    http_req_failed: ['rate<0.01'], //failure rate should be between 0 and 1
    http_reqs: ['count>20'], //how many requests have been sent. it expect to sent atleast 20 requests
    http_reqs: ['rate>4'], //how many requests have been sent per second. more than 5 request must go per sec
    checks: ['rate>=.99'],
    'group_duration{group:::Main Page}': ['p(95)<10000'],
    'group_duration{group:::Search Page}': ['p(95)<350']
  },
  vus: 10, //no. of virtual users
  // duration: '10s', //maximu time the load has to be applied
}

export function setup(){

  const resp = http.get(__ENV.BASE_URL);
  if(resp.error){
    exec.test.abort('Abort Test. Application Down')
  }

}

let myCounter = new Counter('my_counter');

export default async function(){
  // const browser = chromium.launch({ headless: false });

  let page;
  group('Main Page', ()=>{

    page = browser.newPage();
    page.goto(__ENV.BASE_URL);
    myCounter.add(1);

    // console.log(page.content())
    // console.log(page.title())
    page.waitForSelector('.product-input')
    check(page, {
      'Page should contain search field': (page) => (page.locator('.product-input').isVisible() === true),
      'Check Page Title': (page) => (page.title().includes('phactMI'))
    });

    page.locator('.product-input').type('darzalex');
    page.waitForSelector('#dd-auto-select>li', { state: 'visible', strict: false, timeout: 30000 });
      
    const textToMatch = 'darzalex'
    const values = page.$$('#dd-auto-select>li') //$$ means -> findelements, $ mean ->findElement

    for(let each of values){
      const itemText = each.textContent();
      // console.log(itemText)
      if (itemText.trim().toLowerCase() === textToMatch.toLowerCase()) {
        each.click();
        console.log(`Clicked on the dropdown item with text: ${textToMatch}`);
        break;
      }
    }
    page.locator('.keywordSearch').type('dosage')
    sleep(2)
    page.locator('.sc-eHgmQL>button').press('Enter')
    // await page.locator('.sc-eHgmQL>button').click({force:true})
    page.screenshot({ path: 'assets/screenshot_main_page.png' });

  });

  group('Search Page', ()=>{
    page.locator('div.sc-hMFtBS > :nth-child(4)').waitFor({state:'visible'})
    page.locator('div.sc-hMFtBS > :nth-child(4)').click()
    page.waitForSelector('.tab-title ', { state: 'visible' })

    const resp = http.get(page.url())
    check(page, {
      'Page should contain DIR field': (page) => (page.locator('#srd-tab').isVisible() === true),
      'Check Page Title': (page) => (page.title().includes('Search any product information | phactMI'))
    });
    check(resp, {
      'HTTP Repsonse should be 200': (resp) => (resp.status == 200)
    })
      page.screenshot({ path: 'assets/screenshot_search_page.png' });
  });  
}