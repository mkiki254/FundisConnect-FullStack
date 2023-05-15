export default function Service(props){
    return (
        <>
        <div className="service">
            <img src={props.default_picture} alt="electrical works" />
            <div>
                <p className="service--title">{props.title}</p>
                <p className="service--description">{props.description}</p>
            </div>
        </div>
        </>
    )
}