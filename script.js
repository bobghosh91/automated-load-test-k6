import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
    vus: 10,
    duration: '5s'
}

export default function(){

    http.get('https://uat.phactmi.org/search');
    sleep(2)
}