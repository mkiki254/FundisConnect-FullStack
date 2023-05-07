import Testimony from './Testimony'

export default function Testimonials(){
    return (
        <>
        <div className="testimonials">
            <h3 class="testimonials-title">Customer Testimonials</h3>
            <div className="testimonial">
                < Testimony 
                comment = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, neque? Rem, laborum cumque. Est hic reprehenderit possimus nam nemo perferendis perspiciatis veritatis nostrum beatae consequatur!"
                customer_name = "John Odongo"
                />
                    < Testimony 
                comment = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, neque? Rem, laborum cumque. Est hic reprehenderit possimus nam nemo perferendis perspiciatis veritatis nostrum beatae consequatur!"
                customer_name = "Faith Wangeci"
                />
                    < Testimony 
                comment = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, neque? Rem, laborum cumque. Est hic reprehenderit possimus nam nemo perferendis perspiciatis veritatis nostrum beatae consequatur!"
                customer_name = "KUSDA Church"
                />
            </div>
        </div>
        </>
    )
}