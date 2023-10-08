import express from 'express';
import axios from 'axios';

import { initDb } from './models/configDB.js';

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
    let ret = await usuarioDb.insert({
        nome: req.body.nome,
        user: req.body.user,
        password: req.body.password
    });

    console.log('insertId: ', ret.id);
    let usuario = await usuarioDb.getUsuarioById(ret.id),
        log = await logDb.insert('usuario', req.body.usuarioId, '', JSON.stringify(usuario));

    console.log(log);
    // let host = 1;
    await axios.post('http://localhost:3001/mine', {
        data: {
            usuarioId: log.usuario_id,
            before: log.hash_before,
            after: log.hash_after
        }
    }
    );

    res.json({
        status: 'success',
        message: 'Usuário inserido com sucesso!'
    });
});

app.put('/usuario/:id', async (req, res) => {
    await usuarioDb.updateById(req.body, req.params.id);

    res.json({
        status: 'success',
        message: 'Usuário atualizado com sucesso!'
    });
});


// endpoints da tabela pessoa
app.get('/pessoa', async (req, res) => {
    res.json(await pessoaDb.getPessoas());
});

app.get('/pessoa/:id', async (req, res) => {
    res.json(await usuarioDb.getPessoaById(req.params.id));
});

app.post('/pessoa', async (req, res) => {
    await pessoaDb.insert(req.body);

    res.json({
        status: 'success',
        message: 'Pessoa inserida com sucesso!'
    });
});

app.put('/pessoa/:id', async (req, res) => {
    await pessoaDb.updateById(req.body, req.params.id);

    res.json({
        status: 'success',
        message: 'Pessoa atualizada com sucesso!'
    });


});


app.listen(3000, () => console.log('Api rodando na porta ' + HTTP_PORT));