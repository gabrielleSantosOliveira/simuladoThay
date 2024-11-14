import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lateral from './Lateral';
import Header from './Header';
import Cursos from './Cursos';
import Modal from 'react-modal';
import './index.css';

function App() {
    const [empresa, setEmpresa] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(null);  // Estado para armazenar o usuário logado


    // Abrir o modal
    const abrirModal = () => setModalIsOpen(true);

    // Fechar o modal
    const fecharModal = () => setModalIsOpen(false);

    // Função para lidar com o login
    const handleLogin = () => {
        axios.post('http://localhost:3001/api/login', { email, senha })
            .then(response => {
                if (response.data.sucesso) {
                    // Salva as informações do usuário no estado
                    setUsuarioLogado(response.data.usuario);
                    alert('Login bem-sucedido!');
                    fecharModal();
                }
            })
            .catch(error => {
                setErro('Usuário ou senha incorreto');
            });
    };

    // Função para fazer logout
    const handleLogout = () => {
        setUsuarioLogado(null);  // Remove o usuário logado
        window.location.reload(); // Recarrega a página
    };


    useEffect(() => {
        // Fazendo requisição GET para buscar dados da empresa
        axios.get('http://localhost:3001/api/empresa')
            .then(response => {
                setEmpresa(response.data); // Atualiza o estado com os dados da empresa
            })
            .catch(error => console.error("Erro ao buscar dados da empresa:", error));
    }, []);

    return (
        <div className="App">
            <Header />
            <div className='mamae'>
                <div className='lateralDiv'>
                    <Lateral
                        logo={empresa.logo}
                        nome={empresa.nome}
                        abrirModal={abrirModal}
                        usuarioLogado={usuarioLogado}
                        handleLogout={handleLogout} // Passando a função de logout
                        inscricaoLateral={0}
                    />
                </div>
                <div className='cursosDiv'>
                    <div className='apenasdiv'>
                        <h1>
                            Cursos
                        </h1>
                    </div>
                    <Cursos
                        like="flecha_cima_vazia.svg"
                        abrirModal={abrirModal}  // Passando a função abrirModal
                        usuarioLogado={usuarioLogado}
                        numeroInscricao= {0}
                    />

                </div>
            </div>

            {/* Modal de login */}
            <Modal isOpen={modalIsOpen} onRequestClose={fecharModal}>
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderColor: erro ? 'red' : '' }}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={{ borderColor: erro ? 'red' : '' }}
                    />
                </div>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <div>
                    <button onClick={fecharModal} style={{ borderColor: '#22B14C' }}>Cancelar</button>
                    <button onClick={handleLogin} style={{ backgroundColor: '#22B14C', color: 'white' }}>Entrar</button>
                </div>
            </Modal>
        </div>
    );
}

export default App;
