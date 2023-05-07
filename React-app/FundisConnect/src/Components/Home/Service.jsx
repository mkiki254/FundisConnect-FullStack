export default function Service(props){
    return (
        <>
        <div className="service">
            <img src={props.default_picture} alt="electrical works" />
            <div>
                <p class="service--title">{props.title}</p>
                <p class="service--description">{props.description}</p>
            </div>
        </div>
        </>
    )
}