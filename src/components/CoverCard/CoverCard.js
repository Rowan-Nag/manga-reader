import { useEffect, useState } from "react"
import "./CoverCard.css"

function CoverCard(props){
    // const [coverUrl, setUrl] = useState(null);

    // useEffect(()=>{
    //     if(props.shouldFetch){
    //         fetch("https://api.mangadex.org/cover/"+props.coverId, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then(res => res.json())
    //     .then(
    //         (result) => {
                

    //         })
    //     }
    // }, [props.shouldFetch, props.coverId, coverUrl])
    //console.log(props.coverUrl)
    return(
        <div className="CoverCard" style={{"background-image": props.coverUrl }}>
            <span className="CoverText">
                
                <div className="CoverCardTitle">
                    {props.title}
                </div>
                {props.text}

            </span>
        </div>
    )
}

export default CoverCard