// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Comentario({ usuarioLogado, cursoId, onClose }) {
//     const [comentario, setComentario] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [comentarios, setComentarios] = useState([]);

//     // Habilitar campo de edição
//     const habilitarEdicao = () => setIsEditing(true);


//     const handleComentar = () => {
//         if (comentario.trim() === '') {
//             alert('Por favor, escreva um comentário antes de enviar!');
//             return;
//         }

//         axios.post('http://localhost:3001/api/comentarios', {
//             usuarioId: usuarioLogado.id,
//             cursoId: cursoId,
//             texto: comentario
//         })
//             .then(response => {
//                 console.log('Comentário enviado:', response);
//                 // Ação após sucesso, por exemplo, limpar o campo de comentário
//             })
//             .catch(error => {
//                 console.error('Erro ao enviar comentário:', error);
//                 alert('Erro ao enviar o comentário.');
//             });


//         // Chama o back-end para enviar o comentário
//         axios.post('http://localhost:3001/api/comentarios', {
//             usuarioId: usuarioLogado.id,
//             cursoId: cursoId,
//             texto: comentario
//         }).then(response => {
//             alert('Comentário enviado com sucesso!');
//             setComentario(''); // Limpa o campo de comentário
//         }).catch(error => {
//             console.error('Erro ao enviar comentário:', error);
//             alert('Erro ao enviar o comentário.');
//         });
//     };


//     // Função para deletar comentário
//     const handleDeletar = () => {
//         if (window.confirm('Deseja realmente excluir este comentário?')) {
//             axios.delete(`http://localhost:3001/api/comentarios/${cursoId}`)
//                 .then(() => {
//                     alert('Comentário deletado!');
//                     setComentarios(prev => prev.filter(c => c.id !== cursoId));
//                 }).catch(error => console.error('Erro ao excluir comentário:', error));
//         }
//     };

//     return (
//         <div className="comentario">
//             <p>{usuarioLogado.nome}</p>
//             <textarea
//                 value={comentario}
//                 onChange={(e) => setComentario(e.target.value)}
//                 disabled={!usuarioLogado || (isEditing && comentario === '')}
//                 placeholder="Escreva seu comentário"
//             />
//             <div style={{ textAlign: 'right' }}>
//                 <button
//                     style={{ backgroundColor: comentario.trim() ? '#22B14C' : '#C4C4C4', color: '#fff' }}
//                     onClick={handleComentar}
//                     disabled={!comentario.trim()}  // Desabilita o botão se o campo estiver vazio
//                 >
//                     Comentar
//                 </button>


//             </div>
//             {isEditing ? (
//                 <button onClick={handleDeletar} style={{ color: '#FF0000' }}>Excluir</button>
//             ) : (
//                 <img src="lapis_editar.svg" onClick={habilitarEdicao} alt="Editar" />
//             )}
//         </div>
//     );
// }

// export default Comentario;
