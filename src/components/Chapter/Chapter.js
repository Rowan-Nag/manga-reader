import { useEffect, useState } from 'react';
import './Chapter.css'

function Chapter(props){
    const [images, setImages] = useState([])
    let data = props.data;

    useEffect(()=>{
        fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/at-home/server/" + data.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  }
            })
                .then(res => res.json())
                .then((node)=>{
                    //console.log(node);
                    if(node.result === "error"){
                        node.errors.map(error=>{
                            console.error(error.status + " ERROR: " + error.detail)
                            return false
                        })
                    }
                    else{
                        setImages(data.attributes.dataSaver.map((imgSuffix)=>{
                            return (<img className="ChapterImg" src={node.baseUrl + "/data-saver/" + data.attributes.hash + "/"+ imgSuffix} alt="Failed to Load" key = {imgSuffix}></img>)
                        }))
                    }
                })
    }, [props.id, data, data.attributes.dataSaver, data.attributes.hash, data.id])
    
    

    return(

        <div className="Chapter">
            {images}
        </div>
    )
}

export default Chapter