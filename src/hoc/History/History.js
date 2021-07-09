import React, { useEffect, useState } from 'react';
import "./History.css"
import Reader from '../Reader/Reader'

export function updateHistory(mangaTitle, ch, mangaId){

    let alreadyExists = false;
    let history = JSON.parse(localStorage.getItem('lastRead'));
    
    let pos = null;
    
    if(history){
        history = history.map((entry, index)=>{
           

            if(entry["title"] === mangaTitle){
                alreadyExists = true;
                pos = index
                return {"title":mangaTitle, "data":ch.data, "mangaId":mangaId}
            }else{
               
                return entry;
            }
        })
        
        if(pos){
            let temp = history[pos]
            history[pos] = history[0]
            history[0] = temp
        }

        if(!alreadyExists){
            history = [{"title":mangaTitle, "data":ch.data, "mangaId":mangaId}, ...history]
        }
        if(history.length > 5){
            history = history.slice(0, 5)
        }
    }else{
        history = [{"title":mangaTitle, "data":ch.data, "mangaId":mangaId}]
    }
    

    localStorage.setItem('lastRead', JSON.stringify(history));
}

function removeHistory(mangaTitle){
    console.log("removeHistory: "  + mangaTitle)
    let history = JSON.parse(localStorage.getItem('lastRead'));
    
    if(history){
       
        history = history.filter((entry)=>{
            return entry["title"] !== mangaTitle
        })
    }
    localStorage.setItem('lastRead', JSON.stringify(history));
}

export function HistoryBar(props){
    const [count, setCount] = useState(0);
    const [showReader, setShowReader] = useState(false);
    const [reader, setReader] = useState(null)
    const [covers, setCovers] = useState(null)
    let toggleReader = ()=>{
        //console.log("Toggle Reader")
        setReader(null)
    }

    

    useEffect(()=>{
        let history = JSON.parse(localStorage.getItem('lastRead'));
        if(history){
            let ids = history.map((entry)=>{
                return entry.mangaId
            })
            //console.log("https://api.mangadex.org/cover?limit=100&manga[]="+ids.join('&manga[]='))
            fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/cover?limit=100&manga[]="+ids.join('&manga[]='), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
            .then(
                (result) => {
                    
                    console.log(result)
                    if(result.result === "error"){
                        result.errors.map(error=>{
                            console.error(error.status + " ERROR: " + error.detail)
                            return false;
                        })
                    }
                    else{
                        let c = {}
                        result.results.map((cover)=>{
                            if(cover.relationships){
                                if(cover.relationships[0].type==="manga"){
                                    c[cover.relationships[0].id] = cover.data.attributes.fileName
                                }
                            }
                        })
                        setCovers(c)
                        //console.log(c)
                    }
                })
            }
    }, [count])


    let lastRead = ()=>{
        let history = JSON.parse(localStorage.getItem('lastRead'));

        if(history != null){
            return history.map((data)=>{
                let imgUrl = "url(https://uploads.mangadex.org/covers/"+ data.mangaId + "/" + (covers ? covers[data.mangaId]: null) + ")"
                //console.log(imgUrl)
                return (<div className="HistoryCard" style={{"background-image": imgUrl }}>
                    {/* <img src={imgUrl} alt = {"HERE"}/> */}
                    <div className="HistoryClose" onClick={()=>{
                        removeHistory(data.title)
                        setCount(count+1);
                    }}>X</div>
                    <span className={"HistoryText"} onClick={()=>{
                        setReaderData(data.mangaId, data, data.title)
                    }}>
                    
                    <span className="HistoryTitle">{data.title}</span>,<br/>
                    chapter {data.data.attributes.chapter}: {data.data.attributes.title}
                    
                    </span>
                    </div>)
            })
        }

    }
    let setReaderData = (mangaId, chapterData, mangaTitle)=>{
        setReader(<Reader 
            mangaId = {mangaId}
            ch = {chapterData} 
            toggleReader = {toggleReader} 
            manga = {mangaTitle}/>)
        setShowReader(true)
        console.log(true)
    }

    return(
        <div className="History">
            {showReader ? reader : null}
        
            

            <div className="HistoryBar">
                {lastRead()}
            </div>

        </div>

    )

}

