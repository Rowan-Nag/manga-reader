import { useState } from 'react'
import { useEffect } from 'react'
import './MangaFeed.css'

import CoverCard from '../../components/CoverCard/CoverCard'
import MangaCard from '../../components/MangaCard/MangaCard'

function MangaFeed(props){
    const [manga, setManga] = useState(null)

    let SearchManga = async ()=>{
        let coverIds = null
        let mangaData = {}
        await fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/manga?contentRating[]=safe&limit=8", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
        .then(
            (result) => {
                if(result.result === "error"){
                    result.errors.map(error=>{
                        console.error(error.status + " ERROR: " + error.detail)
                        return false;
                    })
                }
                //console.log("mangafeed:")
                //console.log(result)
                // mangaData = {} 
                result.results.map((entry)=>{
                    mangaData[entry.data.id] = entry.data
                    return null
                })
                coverIds = result.results.map((entry)=>{
                    let cover = entry.relationships.filter((relationship)=>{
                        return relationship.type === "cover_art"
                    })
                    if(cover.length > 0){
                        return cover[0].id
                    }
                    return null
                    
                })
                //console.log(coverIds)

                // setManga(result.results.map((entry)=>{
                //     return(<MangaCard 
                //         data={entry.data} 
                //         setReaderData = {props.setReaderData} 
                //         toggleVisible = {props.toggleVisible}
                //         key = {entry.data.id} />)
                // }))
            }
        )

        let covers = await fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/cover?ids[]="+coverIds.join("&ids[]="), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
        .then(
            (result) => {
                if(result.result === "error"){
                    result.errors.map(error=>{
                        console.error(error.status + " ERROR: " + error.detail)
                        return false;
                    })
                }else{
                    result.results.map((cover)=>{
                        let mangaId = cover.relationships.filter((relationship)=>{
                            return relationship.type === "manga"
                        })[0].id
                        mangaData[mangaId].coverUrl = cover.data.attributes.fileName
                        
                    })
                    //console.log(mangaData)
                    setManga(Object.values(mangaData).map((manga, index)=>{
                        return (<CoverCard 
                            key = {index}
                            data = {manga}
                            title={manga.attributes.title.en}
                            coverUrl={"url(https://uploads.mangadex.org/covers/"+manga.id+"/"+manga.coverUrl+")"}
                            setReaderData={props.setReaderData}
                            toggleVisible={props.toggleVisible}
                            />)
                    }))
                }
            })
        
}
    useEffect( ()=>{
        SearchManga()
    } , [props.setReaderData, props.toggleVisible])

    return(
    <div className="MangaFeed">
        {manga}

    </div>
    )
}

export default MangaFeed