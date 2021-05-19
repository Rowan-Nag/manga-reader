import { useEffect, useState } from 'react';
import './Chapter.css'

function Chapter(props){
    const [images, setImages] = useState([])
    let mangaId = props.id
    let data = props.data;

    useEffect(()=>{
        fetch("https://api.mangadex.org/at-home/server/" + data.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  }
            })
                .then(res => res.json())
                .then((node)=>{
                    console.log(node);
                    setImages(data.attributes.dataSaver.map((imgSuffix)=>{
                        return (<img src={node.baseUrl + "/data-saver/" + data.attributes.hash + "/"+ imgSuffix} alt="Failed to Load"></img>)
                    }))
                })
    }, [props.id, props.data])
    return(

        <div className="Chapter">
            {images}
        </div>
    )
}

export default Chapter