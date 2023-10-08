import { openDb } from './configDB.js';
import { sha1 } from '../helper.js';

export async function createTable() {
    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS log (id INTEGER PRIMARY KEY AUTOINCREMENT, tabela TEXT, usuario_id INTEGER, antes TEXT, hash_antes TEXT, depois TEXT, hash_depois TEXT)');
    });
}

export async function insert(tabela, usuario_id, antes, depois) {
    let hashAntes = sha1(antes),
        hashDepois = sha1(depois),
        params = [tabela, usuario_id, antes, depois, hashAntes, hashDepois];

    console.log(params);
    return openDb().then(async db => {
        db.run(`INSERT INTO log(tabela, usuario_id, antes, depois, hash_antes, hash_depois) VALUES (?, ?, ?, ?, ?, ?)`, params);
        console.log('chamou o log.insert', JSON.stringify(params));
        return db.get('SELECT * FROM log ORDER BY id DESC LIMIT 1');
    });
}

export async function getLogs() {
    return openDb().then(async db => {
        return db.all('SELECT * FROM logs');
    });
}