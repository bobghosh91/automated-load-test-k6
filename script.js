import { check, sleep } from 'k6';
import http from 'k6/http';
import exec from 'k6/execution';

export const options = {
    vus: 10,
    duration: '10s',
    thresholds:{
        http_req_duration: ['p(95)<350'],
        http_req_failed: ['rate<0.01'], //failure rate should be between 0 and 1
        http_reqs: ['count>20'], //how many requests have been sent. it expect to sent atleast 20 requests
        http_reqs: ['rate>4'] //how many requests have been sent per second. more than 5 request must go per sec
    }
}

export default function(){

    const response = http.get('https://www.phactmi.org/search');
    
    // console.log('status is: '+response.body);
    console.log(exec.scenario.iterationInTest)

    check(response, {
        'response should be 200': (response) => (response.status==200),
        'body should contain Title': (response) => 
        (response.body.includes('The Pharma Collaboration for Transparent Medical Information'))
    });
    sleep(2);

}

// export default function () {

//     //only applicable for APIs
//     let res = http.get(__ENV.BASE_URL+'/users?page=2');
//     const crocodiles = res.json();
//     console.log(crocodiles['per_page'])

//     //headers "Content-Type":"application/json
//     console.log(res.headers['Content-Type'])
//     console.log(__ENV.BASE_URL)

// }