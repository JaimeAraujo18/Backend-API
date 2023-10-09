import { openDb } from './configDB.js';

export async function createTable() {
    openDb().then(async db => {
        db.exec('CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, usuario TEXT, senha TEXT)');

        let countUsuarios = await getCountUsuarios();
        console.log('countUsuarios: ', countUsuarios.count);
        if (countUsuarios.count == 0) {
            db.exec('INSERT INTO usuario (nome, usuario, senha) VALUES (\'Admin\', \'admin\', \'123\')');
        }
    });
}

export async function insert(usuario) {
    return openDb().then(db => {
        let sql = 'INSERT INTO usuario (nome, usuario, senha) VALUES (?,?,?)';
        db.run(sql, [usuario.name, usuario.user, usuario.password]);

        return db.get('SELECT * FROM usuario ORDER BY id DESC LIMIT 1');
    });
}

export async function updateById(usuario, id) {
    openDb().then(db => {
        let sql = 'UPDATE usuario SET nome=?, usuario=?, senha=? WHERE id = ?';
        db.run(sql, [usuario.name, usuario.user, usuario.password, id]);
    });
}

export async function deleteById(id) {
    openDb().then(db => {
        db.run('DELETE FROM usuario WHERE id = ?', id);
    });
}

export async function getCountUsuarios() {
    return openDb().then(db => {
        return db.get('SELECT count(*) AS count FROM usuario');
    });
}

export async function getUsuarios() {
    return openDb().then(db => {
        return db.all('SELECT * FROM usuario');
    });
}

export async function getUsuarioById(id) {
    return openDb().then(db => {
        return db.get('SELECT * FROM usuario WHERE id = ?', id);
    });
}

export async function login(usuario) {
    return openDb().then(db => {
        return db.get('SELECT * FROM usuario WHERE usuario = ? AND senha = ?', [usuario.user, usuario.password]);
    });
}