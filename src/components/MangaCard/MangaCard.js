import './MangaCard.css'


function MangaCard(props){

    //console.log(props.data)

    let title = ()=>{
        if(props.data.attributes.altTitles.length > 0){
            if(props.data.attributes.altTitles[0].en.length < 20){
                return props.data.attributes.altTitles[0].en
            }
        }

        return props.data.attributes.title.en
        
    }

    let altTitles = ()=>{
        if(props.data.attributes.altTitles.length > 0){
            
            return (<ul className="MangaAltTitles">
                {
                props.data.attributes.altTitles.slice(0, 4).map((title, index)=>{
                    return (<li key = {index}>{title.en}</li>)
                })
                }
            </ul>)
        }
    }

    return(
        
        <div className="MangaContainer">
        <p className="MangaTitle" onClick={()=>{props.setReaderData(props.data); props.toggleVisible()}}>
            {/* {props.data.attributes.altTitles[0].en || props.data.attributes.title.en}  */}
            {title()}
            {altTitles()}
        </p>
        <p className="MangaDescription">Description: {props.data.attributes.description.en}</p>
        </div>
    )
}

export default MangaCard