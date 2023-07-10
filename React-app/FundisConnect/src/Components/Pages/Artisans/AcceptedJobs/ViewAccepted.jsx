import { Button } from 'react-bootstrap'
import { useAuthContext } from '../../../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ViewAccepted(props){
    const { setJobRequestId } = useAuthContext()
    const navigate = useNavigate()

    const isoDateString = props.schedule
    const dateObject = new Date(isoDateString);

    const formattedDate = dateObject.toLocaleString('en-KE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    // console.log(props.job_id)

    function handleJobDetail(){
        setJobRequestId(props.job_id)
        navigate("/artisan-home/accepted-job")
    }

    return (
        <div className='d-flex req text-left'>
            <p className='req-schedule'>{formattedDate}</p>
            <p className='req-title'>{props.job_title}</p>
            <Button onClick={handleJobDetail} className='req-details'>Job Details</Button>
        </div>
    )
}