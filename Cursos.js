import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cursos({ abrirModal, usuarioLogado, like, numeroInscricao}) {
    const [cursos, setCursos] = useState([]);
    const [comentario, setComentario] = useState('');
    const [comentariosCurso, setComentariosCurso] = useState({}); // Estado para controlar se o curso está com comentários carregados
    const [comentarios, setComentarios] = useState({}); // Comentários por curso
    const [comentarioEditado, setComentarioEditado] = useState(null); // Para editar comentário
    const [novaMensagem, setNovaMensagem] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/cursos')
            .then(response => {
                setCursos(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar cursos:", error);
            });
    }, []);

    const handleIconClick = (cursoId) => {
        if (!usuarioLogado) {
            abrirModal();
        } else {
            setComentariosCurso((prevState) => ({
                ...prevState,
                [cursoId]: true // Marcar curso como tendo comentários carregados
            }));

            axios.get(`http://localhost:3001/api/comentarios/${cursoId}`)
                .then(response => {
                    setComentarios((prevState) => ({
                        ...prevState,
                        [cursoId]: response.data // Armazenar comentários do curso
                    }));
                })
                .catch(error => {
                    console.error("Erro ao buscar comentários:", error);
                });
        }
    };

    const handleComentarioChange = (e) => {
        setComentario(e.target.value);
    };

    const handleEnviarComentario = (cursoId) => {
        if (comentario.trim() && usuarioLogado) {
            axios.post('http://localhost:3001/api/comentarios', {
                id_curso: cursoId,
                id: usuarioLogado.id,
                mensagem: comentario
            })
                .then(response => {
                    alert('Comentário enviado!');
                    setComentario('');
                    setComentariosCurso((prevState) => ({
                        ...prevState,
                        [cursoId]: false
                    }));

                    axios.get(`http://localhost:3001/api/comentarios/${cursoId}`)
                        .then(response => {
                            setComentarios((prevState) => ({
                                ...prevState,
                                [cursoId]: response.data
                            }));
                        })
                        .catch(error => {
                            console.error("Erro ao buscar comentários:", error);
                        });
                })
                .catch(error => {
                    console.error("Erro ao enviar comentário:", error);
                });
        } else if (!usuarioLogado) {
            abrirModal();
        } else {
            alert('O comentário não pode estar vazio!');
        }
    };

    const handleEditarComentario = (comentario) => {
        setComentarioEditado(comentario);
        setNovaMensagem(comentario.mensagem);
    };

    const handleAtualizarComentario = (cursoId, idComentario) => {
        if (novaMensagem.trim()) {
            axios.put(`http://localhost:3001/api/comentarios/${idComentario}`, {
                mensagem: novaMensagem,
                id_usuario: usuarioLogado.id
            })
                .then(response => {
                    alert('Comentário atualizado!');
                    setComentarios((prevState) => ({
                        ...prevState,
                        [cursoId]: prevState[cursoId].map((comentario) =>
                            comentario.id_comentario === idComentario
                                ? { ...comentario, mensagem: novaMensagem }
                                : comentario
                        )
                    }));
                    setComentarioEditado(null); // Limpar estado de edição
                })
                .catch(error => {
                    console.error("Erro ao atualizar comentário:", error);
                });
        }
    };

    const handleDeletarComentario = (cursoId, idComentario) => {
        axios.delete(`http://localhost:3001/api/comentarios/${idComentario}`)
            .then(response => {
                alert('Comentário deletado!');
                setComentarios((prevState) => ({
                    ...prevState,
                    [cursoId]: prevState[cursoId].filter(comentario => comentario.id_comentario !== idComentario)
                }));
            })
            .catch(error => {
                console.error("Erro ao deletar comentário:", error);
            });
    };

    return (
        <div className="cursos">
            {cursos.map((curso) => {
                const numComentarios = comentarios[curso.id_curso] ? comentarios[curso.id_curso].length : 0;

                return (
                    <div className="curso" key={curso.id_curso}>
                        <div className="nomeInst">
                            <p>{curso.nome_curso}</p>
                            <p>{curso.instituicao}</p>
                        </div>
                        <div className="fotoCurso">
                            <img className="cursoImg" src={curso.foto} alt={curso.nome_curso} />
                        </div>
                        <div className="svgDiv">
                            <div className="comentarioDiv">
                                <img
                                    className="svg"
                                    src={like}
                                    alt="Inscrição"
                                    onClick={handleIconClick}
                                />
                                <p>{numeroInscricao}</p>
                            </div>
                            <div className="comentarioDiv">
                                <img
                                    className="svg"
                                    src="chat.svg"
                                    alt="comentario"
                                    onClick={() => handleIconClick(curso.id_curso)}
                                />
                                <p>{numComentarios}</p> {/* Mostrar a quantidade de comentários */}
                            </div>
                        </div>

                        {comentariosCurso[curso.id_curso] && (
                            <div className="comentarioBox">
                                <p>{usuarioLogado ? usuarioLogado.nome : 'Usuário não logado'}</p>
                                <textarea
                                    value={comentario}
                                    onChange={handleComentarioChange}
                                    placeholder="Escreva seu comentário..."
                                />
                                <button
                                    onClick={() => handleEnviarComentario(curso.id_curso)}
                                    disabled={!comentario.trim()}
                                >
                                    Comentar
                                </button>
                            </div>
                        )}

                        {comentarios[curso.id_curso] && comentarios[curso.id_curso].map((comentario) => (
                            <div key={comentario.id_comentario} className="comentario" style={{ border: '1px solid #cacaca' }}>
                                <p><strong>{comentario.usuario.nome} ({comentario.usuario.email})</strong></p>
                                <p>{comentario.mensagem}</p>
                                {comentario.id === usuarioLogado.id && (
                                    <>
                                        <img
                                            className="lapisEditar"
                                            src="lapis_editar.svg"
                                            alt="Editar"
                                            onClick={() => handleEditarComentario(comentario)}
                                        />
                                        <img
                                            className="lapisEditar"
                                            src="lixeira_deletar.svg"
                                            alt="Deletar"
                                            onClick={() => handleDeletarComentario(curso.id_curso, comentario.id_comentario)}
                                        />
                                    </>
                                )}

                                {comentarioEditado && comentarioEditado.id_comentario === comentario.id_comentario && (
                                    <div>
                                        <textarea
                                            value={novaMensagem}
                                            onChange={(e) => setNovaMensagem(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleAtualizarComentario(curso.id_curso, comentario.id_comentario)}
                                        >
                                            Atualizar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default Cursos;
