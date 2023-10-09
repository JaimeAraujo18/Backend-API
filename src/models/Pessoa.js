import { openDb } from './configDB.js';

export async function createTable() {
    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS pessoa (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER)');
    });
}

export async function insert(pessoa) {
    return openDb().then(db => {
        let sql = 'INSERT INTO pessoa(nome, idade) VALUES (?,?)';
        db.run(sql, [pessoa.name, pessoa.age]);

        return db.get('SELECT * FROM pessoa ORDER BY id DESC LIMIT 1');
    });
}

export async function updateById(pessoa, id) {
    openDb().then(db => {
        let sql = 'UPDATE pessoa SET nome=?, idade=? WHERE id = ?';
        db.run(sql, [pessoa.name, pessoa.age, id]);
    });
}

export async function deleteById(id) {
    openDb().then(db => {
        db.run('DELETE FROM pessoa WHERE id = ?', id);
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