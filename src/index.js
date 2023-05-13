import express from 'express';

// criação do app api servidor
const app = express();

// parse / converte o JSON para o formato que o dado for (array, objeto, string, number ...)
app.use(express.json());

app.listen(3333, () => console.log("Bombou 🚀"));


app.get('/', (req, res) => {
   
    return res.status(200).send('<h1> Bem vindo </h1>');
    
    
});

const listaUsuarios = []

app.post('/criarusuario',(req, res) => {
    const dados = req.body
// criando um objeto para receber os dados da requisção
// console.log(dados);

const emailExiste = listaUsuarios.some((user) => user.email === dados.email);
    // const senhaExiste = listaUsuarios.some((user) => user.senha === dados.senha);
    // console.log(senhaExiste, emailExiste);

    if (emailExiste){
        return res.status(400).json({
            success: false,
            message: 'Usuário existente',
        })    
    }
    if(!dados.email){
        return res.status(400).json({
            success: false,
            message: 'O campo email é obrigatorio',
        })    
    }    
    if(!dados.senha){
        return res.status(400).json({
            success: false,
            message: 'O campo senha é obrigatorio',
        })    
    }    
    if(!dados.nome){
        return res.status(400).json({
            success: false,
            message: 'O campo nome é obrigatorio',
        })    
    }    
    if(!dados.email.includes('@') || !dados.email.includes('.')){
        return res.status(400).json({
            success: false,
            message: 'É obrigatorio e-mail valido',
        })    
    }
    if (dados.senha.length < 6) {
        return res.status(400).json({
            sucesso: false,
            dados: null,
            mensagem: "É obrigatório informar a senha para cadastro do usuário com no mínimo 6 caracteres"
        })
    }

    const novoUsuario = {
        id: new Date().getTime(),
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        logado: false,
        recados: []
    }
    listaUsuarios.push(novoUsuario);
    
    return res.status(201).json({
        success: true,
        message: 'Usuario criado com sucesso',
        data: novoUsuario
    });
});

app.post('/login', (req, res) => {
    const dados = req.body

    const emailCorreto = listaUsuarios.some((user) => user.email === dados.email);
    const senhaCorreto = listaUsuarios.some((user) => user.senha === dados.senha);
    
// verificar se tem @ e .com
//virificar se a senha tem mais q 6 digitos
    if (!senhaCorreto || !emailCorreto){
        return res.status(400).json({
            success: false,
            message: 'Email ou senha estao incorretos',
            data: null
        })
    }

    if(!dados.email || !dados.senha){
        return res.status(400).json({
            success: false,
            message: 'O campo email e senha é obrigatorio',
        })    
    }

    listaUsuarios.forEach(usuario => usuario.logado === false)
    
    
    const usuario = listaUsuarios.find((user) => user.email === dados.email)

    usuario.logado = true
    
    return res.json({
      success: true,
      message: 'Usuário logado com sucesso',
      data: usuario
    });
});

const listaRecados = [];

app.post('/recados', (req, res) => {
    const dados = req.body

    const usuario = listaUsuarios.find(user => user.logado === true);
    const index = listaUsuarios.findIndex(user => user.logado === true)
//verificar se esta logado    
    if (!usuario){
        return res.status(400).json({
            success: false,
            message: 'Necessario fazer login para criar um post',
          })
    }
    if (!dados.titulo || !dados.descricao) {
        return res.status(400).json({
            success: false,
            message: 'Necessario preencher os campos "titulo" e "descrição" para criar um recado',
          })
    }
// OBJETO DE RECADOS
    const novoRecado = {
        id: new Date().getTime(),
        titulo: dados.titulo,
        descricao: dados.descricao,
    }

// inserir recados no array de de usuarios
listaUsuarios[index].recados.push(novoRecado)

    return res.status(201).json({
        success: true,
        message: 'Recado criado com sucesso',
        data: novoRecado
      })
})

app.put('/recados/:id', (req, res) => {
    const params = req.params

    const usuario = listaUsuarios.find(user => user.logado === true);
    const recadoExiste = usuario.recados.findIndex(user => user.id == params.id)
    console.log(usuario, recadoExiste);

    if (!usuario){
        return res.status(400).json({
            success: false,
            message: 'Necessario fazer login para para editar o post',
        })
    }

    if(recadoExiste < 0){
        return res.status(400).json({
            success: false,
            message: 'recado não existente',
        })
    }

    usuario.recados[recadoExiste].titulo = req.body.titulo
    usuario.recados[recadoExiste].descricao = req.body.descricao

    return res.status(201).json({
        success: true,
        message: 'Recado editado com sucesso',
        data: usuario.recados[recadoExiste]
      })
})




app.delete('/recados/:id', (req, res) => {
    const params = req.params

    const usuario = listaUsuarios.find(user => user.logado === true);
    const posicao = listaUsuarios.findIndex(user => user.logado === true)
    const recadoExiste = usuario.recados.findIndex(user => user.id == params.id)
    
 
    if (!usuario){
        return res.status(400).json({
            success: false,
            message: 'Necessario fazer login para para DELETAaRR o post',
        })
    }

    if (recadoExiste < 0) {
      return res.status(400).json({
        mensagem:'recado nao encontrado',
        sucesso:false
      })
    }


    listaUsuarios[posicao].recados.splice(recadoExiste, 1)

    console.log(listaRecados)
  
    return res.status(200).json({
        sucesso: true,
        mensagem:"DEU CERTOOOOOO",
    })
})

app.get('/recados/:id', (req, res) => {
    const dados = req.params

    const usuario = listaUsuarios.find(user => user.logado === true);
    const recadoExiste = usuario.recados.findIndex(user => user.id == dados.id)

    if (!usuario){
        return res.status(400).json({
            success: false,
            message: 'Necessario fazer login para para DELETAaRR o post',
        })
    }

    if (recadoExiste < 0) {
      return res.status(400).json({
        mensagem:'recado nao encontrado',
        sucesso:false
      })
    }

    return res.status(200).json({
        sucesso: true,
        mensagem:'recado encontrado',
        dados: usuario.recados
    })
    
})

 // joao rafael :)