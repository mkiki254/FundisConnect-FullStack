import { useState, useEffect } from 'react'


export default function Artisan(){  
    useEffect(() => {
        const iframe = document.getElementById('myIframe');
        const container = document.getElementById('iframeContainer');
        const adjustContainerHeight = () => {
          container.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        };
        iframe.addEventListener('load', adjustContainerHeight);
        return () => {
          iframe.removeEventListener('load', adjustContainerHeight);
        };
      }, []);

    return (
        <div id="iframeContainer">
            <iframe 
            id="myIframe"
            src="http://127.0.0.1:8000/admin/"
            style={{
                width: '100%',
                height: '100vh',
                border: 'none',
                overflow: 'hidden',
              }}
            />
        </div>
    )
}


