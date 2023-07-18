import { Button } from 'react-bootstrap'
import PrintedJobList from './PrintedJobList'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function JobList(props){
    const acceptedJobs = props.acceptedJobs

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: true,
        print: async (printIframe) => {
        const document = printIframe.contentDocument;
        if (document) {
            const html = document.getElementsByTagName("html")[0];

            try {
            const canvas = await html2canvas(html);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("FundisConnectJobList.pdf");
            } catch (error) {
            console.log("Error generating PDF:", error);
            }
        }
        },
    });
        
    return (
        <div>
            <Button onClick={handlePrint}>Download</Button>
            <PrintedJobList
            acceptedJobs = {acceptedJobs}
            ref = {componentRef}
            />
        </div>
    )
}