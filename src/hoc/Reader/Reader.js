
import './Reader.css'

import Chapter from "../../components/Chapter/Chapter"
import { useEffect, useState } from 'react'

function Reader(props){

    const [currentChapter, setCurrentChapter] = useState(props.ch.data.attributes.chapter)
    const [chFeed, setChFeed] = useState(props.chFeed)
    let nextChapter = ()=>{
        if(currentChapter+1 < chFeed.length){
            setCurrentChapter(currentChapter-1+2)
        }
        else{
            props.toggleReader();
        }
    }
    let prevChapter = ()=>{
        if(currentChapter > 1){
            setCurrentChapter(currentChapter-1)
        }else{
            props.toggleReader();
        }
    }

    useEffect(()=>{
        
        if(!chFeed){
            
            fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/manga/"+ props.mangaId + "/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  }
            })
                .then(res => res.json())
                .then((chapters)=>{
                    //console.log(chapters)
                    if(chapters.result === "error"){
                        chapters.errors.map(error=>{
                            console.error(error.status + " ERROR: " + error.detail)
                            return false;
                        })
                    }
                    else{
                        setChFeed(chapters.results);
                        //console.log(chFeed)
                    }
                }
                    
                )
        }
    }, [chFeed, props.mangaId])

    let chData = chFeed ? chFeed[currentChapter-1].data : props.ch.data;
    //console.log(chData)
    return(
        <div className="Reader">
            <div className="ReaderSidebar">
                <div className="ReaderSidebarContent">
                    <div className="ReaderBackButton" onClick={props.toggleReader}> &lt;--</div>
                    <div className="ReaderChapterInfo">
                        <b>{props.manga} </b><br/>
                        Chapter {chData.attributes.chapter}, <br/>
                        Volume {chData.attributes.volume}, <br/>
                        {chData.attributes.title}
                    </div>
                    <div className="NavigationButtons">
                        <div onClick={prevChapter}>Previous Chapter</div>
                        <p></p>
                        <div onClick={nextChapter}>Next Chapter</div>
                    
                    </div>
                </div>
            </div>
            <div className="ReaderMain">
                
                {(props.ch) ? (<Chapter data={chData}/>) : (<div>No Chapter Loaded</div>)}

            </div>
        </div>
    )
}

export default Reader