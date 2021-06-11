import './Main.css'
import Searcher from '../Searcher/Searcher'
import * as History from "../History/History";
function Main(){
    return(
        <div>
            <History.HistoryBar></History.HistoryBar>
            <Searcher></Searcher>


            

            
        </div>
    )
}

export default Main