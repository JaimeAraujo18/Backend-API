
import crypto from 'crypto';

export function sha1(object) {
    let hash = crypto.createHash('sha1').update(object).digest('hex');

    console.log('sha1: ', hash);
    return hash;
};