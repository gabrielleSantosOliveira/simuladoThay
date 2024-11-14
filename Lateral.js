function Lateral({ logo, nome, abrirModal, usuarioLogado, handleLogout, inscricaoLateral }) {
    
    return (
        <div className="lateral">
            <div className="logo">
                {!usuarioLogado ? (
                    // Caso o usuário não esteja logado, exibe o logo e nome da empresa
                    <>
                        <button onClick={abrirModal}>Entrar</button>
                        <img className="imgLogo" src={logo} alt={nome} />
                        <h1>{nome}</h1>

                    </>
                ) : (
                    // Se o usuário estiver logado, exibe a foto e nome do usuário com o botão "Sair"
                    <>
                        <button onClick={handleLogout}>Sair</button> {/* Botão de logout */}
                        <img className="imgLogo" src={usuarioLogado.foto} alt={usuarioLogado.nickname} />
                        <h1>{usuarioLogado.nome}</h1> {/* Nome do usuário */}
                    </>
                )}
            </div>
            <div className="inscricao">
                <h1>Inscrições: {inscricaoLateral}</h1>
            </div>

        </div>
    );
}

export default Lateral;
