export default function(props){
    return (
     <>
     <div className="testimony">
        <p className="customer-testimony">{props.comment}</p>
        <p className="customer-name">{props.customer_name}</p>
     </div>
     </>
    )
}