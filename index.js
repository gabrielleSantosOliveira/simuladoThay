const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');

// Configuração do banco de dados (integrada diretamente aqui)
const sequelize = new Sequelize('simulado', 'root', 'admin', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});

// Inicialize o express antes das rotas
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Definição do modelo de Empresa
const Empresa = sequelize.define('empresa', {
    id_empresa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.TEXT
    },
    logo: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Definição do modelo de Curso
const Curso = sequelize.define('curso', {
    id_curso: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    foto: {
        type: Sequelize.TEXT
    },
    nome_curso: {
        type: Sequelize.TEXT
    },
    instituicao: {
        type: Sequelize.TEXT
    },
    empresa_id: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Definição do modelo de Usuario
const Usuario = sequelize.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT
    },
    nickname: {
        type: Sequelize.TEXT
    },
    senha: {
        type: Sequelize.INTEGER
    },
    foto: {
        type: Sequelize.TEXT
    },
    createdAt: {
        type: Sequelize.TEXT
    },
    updatedAt: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Definição do modelo de Comentario
// Comentario.belongsTo(Usuario, { foreignKey: 'id' });

const Comentario = sequelize.define('comentario', {
    id_comentario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true  // Definido como auto-incremento
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'curso',  // Nome da tabela referenciada
            key: 'id_curso'  // Chave primária da tabela referenciada
        }
    },
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',  // Nome da tabela referenciada
            key: 'id'  // Chave primária da tabela referenciada
        }
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Relacionamentos (Chaves estrangeiras)
Comentario.belongsTo(Curso, { foreignKey: 'id_curso' });
Comentario.belongsTo(Usuario, { foreignKey: 'id' });

// Definição do modelo de Inscricao
const Inscricao = sequelize.define('inscricao', {
    id_inscricao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id'
        }
    },
    id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'curso',
            key: 'id_curso'
        }
    }
}, { freezeTableName: true, timestamps: false });

// Relacionamentos (chaves estrangeiras)
Comentario.belongsTo(Curso, { foreignKey: 'id_curso' });
Comentario.belongsTo(Usuario, { foreignKey: 'id' });
Inscricao.belongsTo(Curso, { foreignKey: 'id_curso' });
Inscricao.belongsTo(Usuario, { foreignKey: 'id' });

// Rota para obter todos os cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const listaCursos = await Curso.findAll();
        res.json(listaCursos);
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ error: "Erro ao buscar cursos" });
    }
});
// Rota para atualizar o comentário
app.put('/api/comentarios/:id_comentario', async (req, res) => {
    const { id_comentario } = req.params;
    const { mensagem, id_usuario } = req.body;  // Mensagem e id do usuário que está tentando editar

    try {
        // Verificar se o comentário pertence ao usuário que está tentando editar
        const comentario = await Comentario.findOne({
            where: { id_comentario, id: id_usuario }  // Verifica se o id do usuário corresponde ao id do comentário
        });

        if (!comentario) {
            return res.status(403).json({ sucesso: false, mensagem: 'Você não pode editar este comentário.' });
        }

        // Atualizar o comentário no banco de dados
        comentario.mensagem = mensagem;
        await comentario.save();

        res.json({ sucesso: true, mensagem: 'Comentário atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar comentário:", error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar comentário' });
    }
});


// Rota para obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
    const listaUsuarios = await Usuario.findAll();
    res.json(listaUsuarios);
});

// Rota para autenticação de usuário
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    // Verificar se o usuário existe com o email e senha fornecidos
    const usuario = await Usuario.findOne({
        where: {
            email: email,
            senha: senha
        }
    });

    if (usuario) {
        res.json({ sucesso: true, usuario: usuario });
    } else {
        res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha incorreto' });
    }
});

// Rota para obter os dados da empresa
app.get('/api/empresa', async (req, res) => {
    const empresa = await Empresa.findOne(); // Pega o primeiro registro
    res.json(empresa);
});

// Rota para registrar o comentário
app.post('/api/comentarios', async (req, res) => {
    const { id_curso, id, mensagem } = req.body;

    try {
        // Buscar o usuário pelo id
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(400).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
        }

        // Cria o comentário no banco de dados
        const comentario = await Comentario.create({
            mensagem: mensagem,
            id_curso: id_curso,
            id: id // Coloca o id do usuário
        });

        res.status(201).json({
            sucesso: true,
            comentario: comentario,
            nome_usuario: usuario.nome // Retorna o nome do usuário junto com o comentário
        });
    } catch (error) {
        console.error("Erro ao salvar comentário:", error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar comentário' });
    }
});

// Rota para obter comentários de um curso específico
app.get('/api/comentarios/:id_curso', async (req, res) => {
    const { id_curso } = req.params;

    try {
        // Buscar os comentários do curso, incluindo o nome do usuário
        const comentarios = await Comentario.findAll({
            where: {
                id_curso: id_curso
            },
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'email']  // Inclui o nome e o e-mail do usuário
                }
            ]
        });

        res.json(comentarios);
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        res.status(500).json({ error: "Erro ao buscar comentários" });
    }
});


app.delete('/api/comentarios/:id', (req, res) => {
    const { id } = req.params;
    // Lógica para deletar o comentário no banco de dados
    Comentario.destroy({ where: { id_comentario: id } })
        .then(() => res.status(200).send('Comentário deletado com sucesso'))
        .catch(err => res.status(500).send('Erro ao deletar comentário'));
});

// Rota para deletar o comentário
app.delete('/api/comentarios/:id_comentario', async (req, res) => {
    const { id_comentario } = req.params;
    const { id_usuario } = req.body;  // ID do usuário que está tentando excluir o comentário

    try {
        // Verificar se o comentário pertence ao usuário que está tentando excluir
        const comentario = await Comentario.findOne({
            where: { id_comentario, id: id_usuario }  // Verifica se o id do usuário corresponde ao id do comentário
        });

        if (!comentario) {
            return res.status(403).json({ sucesso: false, mensagem: 'Você não pode excluir este comentário.' });
        }

        // Excluir o comentário no banco de dados
        await comentario.destroy();

        res.json({ sucesso: true, mensagem: 'Comentário excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir comentário:", error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir comentário' });
    }
});


(async () => {
    try {
        // Conectando ao banco de dados
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        // Sincroniza os modelos com o banco de dados
        await sequelize.sync();

        // Inicia o servidor após a conexão bem-sucedida
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
})();
