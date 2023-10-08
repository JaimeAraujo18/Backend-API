import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createTable as createTableUsuario } from './Usuario.js';
import { createTable as createTablePessoa } from './Pessoa.js';
import { createTable as createTableLog } from './Log.js';

export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    })
};

export async function initDb() {
    await Promise.all([
        createTableUsuario(),
        createTablePessoa(),
        createTableLog(),
    ]).then(() => {
        console.log('terminou de rodar');
    })
};