export default function Choose(props){
    return (
        <>
        <div className="reason--listed">
            <p className="reason--stated">{props.reason}</p>
            <p className="reason--explained">{props.explanation}</p>
        </div>        
        </>
    )
}