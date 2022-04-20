import React, { useEffect, useState } from 'react'

import { Document, Page, pdfjs,  } from 'react-pdf'
import { useLocation } from 'react-router';
import TextButton from '../components/ui/Buttons/Text';
import { isUsable } from '../helpers/functions';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReaderPage = props => {

	const params = useLocation()

	const [PdfUrl, setPdfUrl] = useState(null)
	const [CurrentPage, setCurrentPage] = useState(1)
	const [TotalPages, setTotalPages] = useState(null)

	useEffect(() => { setPdfUrl(params.state.book) }, [params])

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