
import crypto from 'crypto';
import axios from 'axios';

export function sha1(object) {
    let hash = crypto.createHash('sha1').update(object).digest('hex');

    console.log('sha1: ', hash);
    return hash;
};

export async function sendLog(log) {
    let servers = [
        'http://localhost:3001/mine',
        'http://localhost:3002/mine',
        'http://localhost:3003/mine',
        'http://localhost:3004/mine'
    ];

    await axios.post(servers[getRandomInt(4)], {
        data: {
            logId: log.id,
            usuarioId: log.usuario_id,
            before: log.hash_antes,
            after: log.hash_depois
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}