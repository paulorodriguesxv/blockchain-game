
const CardListView = (props) => {

    const {tokens} = props
    
    return (
        <div>
            <h5>Tokens Collected:<span id="result">&nbsp;{tokens.length}</span></h5>

            <div className="grid mb-4" >

            { tokens.map((tokenURI, key) => {
                return(
                <img
                    key={key}
                    src={tokenURI}
                />
                )
            })}

            </div>        
        </div>
    )
}


export default CardListView