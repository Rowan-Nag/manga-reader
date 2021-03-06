import '../ChapterList/ChapterList.css'
import Reader from "../Reader/Reader"
import { useEffect, useState } from 'react';
import * as History from "../History/History.js";

function ChapterFeed(props){
    //const [hidden, setHidden] = useState(props.display)
  
    const [chapterList, setChapterList] = useState(null)
    const [pageNumber, setPageNumber] = useState(0)
    const [showReader, setShowReader] = useState(false);
    const [fullChapterFeed, setFullChapterFeed] = useState(null);
    const [readerCh, setReaderCh] = useState(null);


    
    // useEffect()=>{

    // }

    let toggleReader = ()=>{
        //console.log("Toggle Reader")
        setShowReader(!showReader)
    }
    let title = "No Title Loaded"
    let description = "No Description Loaded"
    if(props.data !== ""){
        title = props.data.attributes.title.en
        description = props.data.attributes.description.en
    }
    
    useEffect(()=>{
        if(props.data !== "" && chapterList == null){
            fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/manga/"+ props.data.id + "/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500", {
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
                        let urlRegex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"
                        setFullChapterFeed(chapters.results);
                        console.log(chapters.results)
                        setChapterList(chapters.results.map((ch)=>{
                            if(ch.data.attributes.data[0].match(urlRegex)){
                                return (
                                    <div className="ChapterEntry" 
                                    key = {ch.data.id}
                                    onClick={()=>{
                                    
                                    
                                }}>
                                    <a href={ch.data.attributes.data[0]} target="_blank">
                                        <span className="ChapterText"><b>ch. {ch.data.attributes.chapter}</b> {ch.data.attributes.title}</span>
                                        <span className="ChapterWarning"> Link will open in a new tab! </span>
                                        <span className="ChapterDate">{ch.data.attributes.publishAt.substring(0, 10)}</span>
                                    </a>
                                </div>)
                            }
                            else{
                                return (
                                    <div className="ChapterEntry" 
                                    key = {ch.data.id}
                                    onClick={()=>{
                                        toggleReader()
                                        History.updateHistory(props.data.attributes.title.en, ch, props.data.id);
                                        setReaderCh(ch)
                                        
                                    }}>
                                        <span className="ChapterText"><b>ch. {ch.data.attributes.chapter}</b> {ch.data.attributes.title}</span>
                                        <span className="ChapterDate">{ch.data.attributes.publishAt.substring(0, 10)}</span>
                                    </div>)
                            }
                        }))
                        
                    }
                }
                    
                )
        }
    }, [props.data.id, props.data])

    let displayedChapters = ()=>{
        if(chapterList != null){
            return(chapterList.slice(pageNumber*20, (pageNumber+1)*20))
        }
    }

    return(
        <div className="ChapterList">
            
            <div className="ListContainer">
                <div className="ListInner">
                    <p>manga-id: {props.data.id}</p>
                    <div className="ListInfo">
                        <div className="ListInfoHeader">
                            {props.data.image ? <img className="ListCover" src={props.data.image.substring(4,props.data.image.length-1)} alt="Cover"/> : null}
                            <p className="ListTitle">{title}</p>

                        </div>
                        <p className="ListDesc">{description}</p>

                    </div>

                    <div className="ListDisplay">
                        <div className="ListDisplayHeader">
                            <span className="PageArrow" onClick={()=>{
                                if(pageNumber > 0){
                                    //setChapterList(null)
                                    setPageNumber(pageNumber-1)
                                }
                            }}>&lt;</span>
                            &nbsp;&nbsp;{pageNumber+1}&nbsp;&nbsp;
                            <span className="PageArrow" onClick={()=>{
                                if(chapterList.length >= 20*pageNumber+20){
                                    //setChapterList(null)
                                    setPageNumber(pageNumber+1)
                                }
                            }}>&gt;</span>
                            </div>
                        {displayedChapters()}
                    </div>

                </div>
            
            </div>
            {showReader ? <Reader chFeed = {fullChapterFeed} ch = {readerCh} toggleReader = {toggleReader} manga = {title}/> : null}
            {/* <Reader ch = {readerCh} visibility = {readerVisibility} setReaderVisibility = {setReaderVisibility}/> */}
        </div>
    )
}

export default ChapterFeed