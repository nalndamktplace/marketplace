import React, { useEffect, useState } from 'react'

import { Document, Page, pdfjs,  } from 'react-pdf'
import TextButton from '../components/ui/Buttons/Text';
import { isUsable } from '../helpers/functions';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReaderPage = props => {

	const [PdfUrl, setPdfUrl] = useState("https://ipfs.infura.io/ipfs/QmdRR1DgqAd5GStzsvbG3dK3nh7ghMKPzuQomHoVtQJuo3?filename=test.pdf")
	const [CurrentPage, setCurrentPage] = useState(1)
	const [TotalPages, setTotalPages] = useState(null)

	useEffect(() => {
		// if(isUsable(TotalPages) && TotalPages > 0){
		// 	var img = document.getElementsByClassName('react-pdf__Page__canvas')
		// 	var container = document.getElementsByClassName('reader__content__wrapper__page')
		// 	if(img.length>0 && container.length>0){
		// 		console.log("Scaling")
		// 		img = img[0]
		// 		container = container[0]
	
		// 		var width = img.width
		// 		var height = img.height
		// 		var maxWidth = container.width
		// 		var maxHeight = container.height
	
		// 		var ratio = maxWidth / width
		// 		if(height * ratio > maxHeight) ratio = maxHeight / height
	
		// 		img.width = (width * ratio)
		// 		img.height = (height * ratio)
		// 	}
		// }
	}, [TotalPages])

	const onDocLoadSucHandler = ({numPages}) => { setTotalPages(numPages) }

	const docPrevPageHandler = () => { setCurrentPage(old => old-1) }
	const docNextPageHandler = () => { setCurrentPage(old => old+1) }

	return(
		<div className='reader'>
			<div className='reader__content'>
				{isUsable(PdfUrl)?
					<Document file={PdfUrl} onSourceError={err => console.log({sourceError: err})} onLoadSuccess={onDocLoadSucHandler} onLoadError={err => console.log({loadError: err})}
						className='reader__content__wrapper'
						renderMode='svg'
						options={{
							standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`
						}}>
						<Page className='reader__content__wrapper__page' pageNumber={CurrentPage} />
					</Document>
				:null}
			</div>
			<nav className='reader__nav'>
				<TextButton label={'Previous'} onClick={()=>docPrevPageHandler()}/>
				<div className='reader__counter'>
					Page {CurrentPage} of {TotalPages}
				</div>
				<TextButton label={'Next'} onClick={()=>docNextPageHandler()}/>
			</nav>
		</div>
	)
}

export default ReaderPage