'use client'

import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => <p className="text-center p-4">Sedang memuat PDF Viewer...</p>,
});

export default function WriteUpPdf({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const param = React.use(params)
    const pdfUrl = "/write-up-assets/"+param.slug+".pdf"

    return (
        <main className="pt-0 md:pt-10 lg:pt-10 pb-16 px-4 min-h-screen">
            <div className="max-w-4xl p-2 mx-auto">
                <Link
                    href="/write-up"
                    className="inline-block text-xs text-gray-400 hover:text-neon-green mb-6 transition-colors"
                >
                    ← BACK TO WRITE UPS
                </Link>
                <article className="prose text-md prose-invert prose-green max-w-none font-sans">
                    <PdfViewer url={pdfUrl} />
                </article>
            </div>
        </main>
    );
}