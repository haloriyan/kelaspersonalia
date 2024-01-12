import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import {pdfjs} from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import config from "../config";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

const PdfViewer = () => {
    const {filename} = useParams();
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalHeight, setTotalHeight] = useState(0);

    const areaRef = useRef(null);

    const [scroll, setScroll] = useState(0);
    
    const onLoadSuccess = ({numPages}) => {
        setNumPages(numPages);
    }

    const handleScroll = e => {
        let pos = window.scrollY;
        setScroll(pos);
    }

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (areaRef.current) {
            let interval = setInterval(() => {
                let theHeight = areaRef.current.clientHeight;
                setTotalHeight(theHeight);
            }, 500);

            return () => clearInterval(interval);
        }
    }, [areaRef]);

    useEffect(() => {
        if ((totalHeight - scroll) < 600) {
            window.localStorage.setItem('able_to_change', '1');
        } else {
            window.localStorage.setItem('able_to_change', '0');
        }
    }, [totalHeight, scroll]);

    return (
        <>
            <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'center'}} ref={areaRef}>
                <Document file={`${config.baseUrl}/document/` + btoa(`storage/modul_documents/${filename}`)} onLoadSuccess={onLoadSuccess}>
                    {[...Array(numPages).keys()].map((pageNumber) => (
                        <Page key={pageNumber + 1} pageNumber={pageNumber + 1} />
                    ))}
                </Document>
            </div>
        </>
    )
}

export default PdfViewer;