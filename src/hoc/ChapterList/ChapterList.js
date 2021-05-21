import './ChapterList.css'
import Reader from "../Reader/Reader"
import { useEffect, useState } from 'react';
function ChapterList(props){
    //const [hidden, setHidden] = useState(props.display)
  
    const [chapterList, setChapterList] = useState(null)
    const [pageNumber, setPageNumber] = useState(0)
    const [showReader, setShowReader] = useState(false);
   
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
        if(props.data !== "" && chapterList === null){
            fetch("https://api.mangadex.org/chapter?order[chapter]=asc&limit=20&translatedLanguage=en&manga=" + props.data.id + "&offset=" + (20*pageNumber).toString(), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  }
            })
                .then(res => res.json())
                .then((chapters)=>{
                    console.log(chapters)
                    setChapterList(chapters.results.map((ch)=>{
                        
                        return (
                        <div className="ChapterEntry" 
                        key = {ch.data.id}
                        onClick={()=>{
                            toggleReader()
                            
                            setReaderCh(ch)
                            
                        }}>
                            <span className="ChapterText"><b>ch. {ch.data.attributes.chapter}</b> {ch.data.attributes.title}</span>
                            <span className="ChapterDate">{ch.data.attributes.publishAt.substring(0, 10)}</span>
                        </div>)
                    }))
                }
                    
                )
        }
    })

    return(
        <div className="ChapterList">
            
            <div className="ListContainer">
                <div className="ListInner">
                    <p>manga-id: {props.data.id}</p>
                    <div className="ListInfo">
                        <p className="ListTitle">{title}</p>

                        <p className="ListDesc">{description}</p>

                    </div>

                    <div className="ListDisplay">
                        <div className="ListDisplayHeader">
                            <span className="PageArrow" onClick={()=>{
                                if(pageNumber > 0){
                                    setChapterList(null)
                                    setPageNumber(pageNumber-1)
                                }
                            }}>&lt;</span>
                            &nbsp;&nbsp;{pageNumber+1}&nbsp;&nbsp;
                            <span className="PageArrow" onClick={()=>{
                                if(chapterList.length >= 20){
                                    setChapterList(null)
                                    setPageNumber(pageNumber+1)
                                }
                            }}>&gt;</span>
                            </div>
                        {chapterList}
                    </div>

                </div>
            
            </div>
            {showReader ? <Reader ch = {readerCh} toggleReader = {toggleReader}/> : null}
            {/* <Reader ch = {readerCh} visibility = {readerVisibility} setReaderVisibility = {setReaderVisibility}/> */}
        </div>
    )
}

export default ChapterList