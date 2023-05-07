export default function(props){
    return (
     <>
     <div class="testimony">
        <p class="customer-testimony">{props.comment}</p>
        <p class="customer-name">{props.customer_name}</p>
     </div>
     </>
    )
}