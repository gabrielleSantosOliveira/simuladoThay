function Header (){

    const insta = 'instagram.webp'
    const twitter = 'twitter.png'

    return(
        

        <div className="header">
            <div className="nome">
                <h1>
                    FaculHub- O curso certo para você
                </h1>
            </div>
            <div className="redesDiv">
                <img className="redes" src={insta} alt="instagram"/>
                <img className="redes" src={twitter} alt="instagram"/>

            </div>

        </div>

    )
}

export default Header