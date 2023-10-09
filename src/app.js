import express from 'express';

import { initDb } from './models/configDB.js';
import { sendLog } from './helper.js';

// load model file to interact with its methods
import * as usuarioDb from './models/Usuario.js';
import * as pessoaDb from './models/Pessoa.js';
import * as logDb from './models/Log.js';

// get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// create a new app
const app = express();

// using the express json middleware
app.use(express.json());

// initialize SQLite database
await initDb();




// login endpoint
app.post('/login', async (req, res) => {
    console.log(req.body);
    if ((typeof req.body.user != 'string' || req.body.user.length == 0) || (typeof req.body.password != 'string' || req.body.password.length == 0)) {
        res.status(400); // bad request
        return res.json({
            status: 'error',
            message: 'Usuário e senha devem ser informados!',
        });
    } else {
        let usuario = await usuarioDb.login({ user: req.body.user, password: req.body.password });

        console.log(usuario);
        if (usuario && usuario.id) {
            res.status(200);
            res.json({
                status: 'success',
                message: 'Login realizado com sucesso!',
                user: usuario
            });
        } else {
            res.status(401); // unathorized
            res.json({
                status: 'error',
                message: 'Usuário e senha incorretos!'
            });
        }
    }
});






// endpoints da tabela usuario
app.get('/usuario', async (req, res) => {
    res.json(await usuarioDb.getUsuarios());
});

app.get('/usuario/:id', async (req, res) => {
    res.json(await usuarioDb.getUsuarioById(req.params.id));
});

app.post('/usuario', async (req, res) => {
    let usuario = await usuarioDb.insert({
        name: req.body.name,
        user: req.body.user,
        password: req.body.password
    });

    let log = await logDb.insert('usuario', req.body.userId, '', JSON.stringify(usuario));

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Usuário inserido com sucesso!'
    });
});

app.put('/usuario/:id', async (req, res) => {
    let usuarioAntes = await usuarioDb.getUsuarioById(req.params.id);

    await usuarioDb.updateById(req.body, req.params.id);

    let usuarioDepois = await usuarioDb.getUsuarioById(req.params.id);

    let log = await logDb.insert('usuario', req.body.userId, JSON.stringify(usuarioAntes), JSON.stringify(usuarioDepois));

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Usuário atualizado com sucesso!'
    });
});

app.delete('/usuario/:id', async (req, res) => {
    let usuarioAntes = await usuarioDb.getUsuarioById(req.params.id);

    await usuarioDb.deleteById(req.params.id);

    let log = await logDb.insert('usuario', req.body.userId, JSON.stringify(usuarioAntes), '');

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Usuário excluído com sucesso!'
    });
});





// endpoints da tabela pessoa
app.get('/pessoa', async (req, res) => {
    res.json(await pessoaDb.getPessoas());
});

app.get('/pessoa/:id', async (req, res) => {
    res.json(await pessoaDb.getPessoaById(req.params.id));
});

app.post('/pessoa', async (req, res) => {
    let pessoa = await pessoaDb.insert({
        name: req.body.name,
        age: req.body.age,
    });

    let log = await logDb.insert('pessoa', req.body.userId, '', JSON.stringify(pessoa));

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Pessoa inserida com sucesso!'
    });
});

app.put('/pessoa/:id', async (req, res) => {
    let pessoaAntes = await pessoaDb.getPessoaById(req.params.id);

    await pessoaDb.updateById(req.body, req.params.id);

    let pessoaDepois = await pessoaDb.getPessoaById(req.params.id);

    let log = await logDb.insert('pessoa', req.body.userId, JSON.stringify(pessoaAntes), JSON.stringify(pessoaDepois));

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Pessoa atualizada com sucesso!'
    });
});

app.delete('/pessoa/:id', async (req, res) => {
    let pessoaAntes = await pessoaDb.getPessoaById(req.params.id);

    await pessoaDb.deleteById(req.params.id);

    let log = await logDb.insert('pessoa', req.body.userId, JSON.stringify(pessoaAntes), '');

    sendLog(log);

    res.json({
        status: 'success',
        message: 'Pessoa excluída com sucesso!'
    });
});

// endpoints da tabela Logs
app.get('/log', async (req, res) => {
    res.json(await logDb.getLogs());
});

app.listen(3000, () => console.log('Api rodando na porta ' + HTTP_PORT));