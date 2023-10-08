import { openDb } from './configDB.js';

export async function createTable() {
    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS pessoa (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER)');
    });
}

export async function insert(pessoa) {
    let args = [],
        params = [...Object.keys(pessoa), Object.values(pessoa)];

    for (let i = 0; i < Object.keys(pessoa).length; i++) {
        obj.args.push('?');
    }

    args = args.join(',');
    openDb().then(db => {
        db.exec(`INSERT INTO pessoa(${args}) VALUES (${args})`, params);
    });
}

export async function updateById(pessoa, id) {
    let args = [],
        params = [];

    for (const key in pessoa) {
        args.push('? = ?');
        params.push(...[key, pessoa[key]]);
    }

    params.push(id);
    args = args.join(',');
    openDb().then(db => {
        db.exec(`UPDATE pessoa SET ${args} where id = ?`, params);
    });
}

export async function deleteById(id) {
    openDb().then(db => {
        db.exec(`DELETE FROM pessoa WHERE id = ?`, id);
    });
}

export async function getPessoas() {
    return openDb().then(async db => {
        return db.all('SELECT * FROM pessoa');
    });
}

export async function getPessoaById(id) {
    return openDb().then(async db => {
        return db.get('SELECT * FROM pessoa WHERE id = ?', id);
    });
}