import { Button } from 'react-bootstrap'

export default function ViewRequests(props){
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

    return (
        <div className='d-flex req text-left'>
            <p className='req-schedule'>{formattedDate}</p>
            <p className='req-title'>{props.job_title}</p>
            <Button className='req-details'>Job Details</Button>
        </div>
    )
}