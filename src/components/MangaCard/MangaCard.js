import './MangaCard.css'


function MangaCard(props){


    return(
        
        <div className="MangaContainer">
         <p className="MangaTitle"
         onClick={()=>{props.setReaderData(props.data); props.toggleVisible()}}>{props.data.attributes.title.en}</p>
         <p className="MangaDescription">Description: {props.data.attributes.description.en}</p>
        </div>
    )
}

export default MangaCard