'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(600);

  React.useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('pdf-wrapper');
      if (container) {
        setWidth(container.clientWidth - 40);
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div id="pdf-wrapper" className="pdf-container">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="loading-state">Sedang memuat dokumen...</div>}
        error={<div className="error-state">Gagal memuat PDF. Pastikan URL benar.</div>}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} className="page-wrapper">
            <Page
              pageNumber={index + 1}
              width={width}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
            <div className="page-divider">
                <span className="page-number">Halaman {index + 1}</span>
            </div>
          </div>
        ))}
      </Document>

      <style jsx>{`
        .pdf-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 50vh;
        }
        .page-wrapper {
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          background: white;
        }
        .page-divider {
          text-align: center;
          margin-top: 8px;
          color: #888;
          font-size: 0.8rem;
        }
        .loading-state, .error-state {
          padding: 50px;
          text-align: center;
          color: #666;
          background: #f0f0f0;
          border-radius: 8px;
          width: 100%;
        }
        :global(.react-pdf__Page__canvas) {
          margin: 0 auto;
          display: block;
        }
      `}</style>
    </div>
  );
}