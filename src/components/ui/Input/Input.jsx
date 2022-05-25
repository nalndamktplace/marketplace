import React, { useState } from 'react'

import InputModal from './Modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'

const InputField = props => {

	const [ShowValues, setShowValues] = useState(false)

	const renderInputField = () => {
		switch (props.type) {
			case 'text':
				return <textarea className='input__group__field input__group__field--text typo__body' type={'text'} rows={props.lines} required value={props.value} onChange={props.onChange}/>
			case 'date':
				return <input className='input__group__field typo__body' type={'date'} required value={props.value} onChange={props.onChange}/>
			case 'string':
				return <input className='input__group__field typo__body' type={'text'} required value={props.value} onChange={props.onChange}/>
			case 'email':
				return <input className='input__group__field typo__body' type={'email'} required value={props.value} onChange={props.onChange}/>
			case 'number':
				return <input className='input__group__field typo__body' type={'number'} required value={props.value} onChange={props.onChange}/>
			case 'range':
				return <input className='input__group__field typo__body' type={'range'} required value={props.value} onChange={props.onChange} min={props.min} max={props.max} step={props.step}/>
			case 'password':
				return <input className='input__group__field typo__body' type={'password'} required value={props.value} onChange={props.onChange}/>
			case 'telephone':
				return <input className='input__group__field typo__body' type={'tel'} required value={props.value} onChange={props.onChange}/>
			case 'file':
				return <input className='input__group__field typo__body' type={'file'} accept={props.file} required onChange={props.onChange}/>
			case 'list':
				return <React.Fragment>
					{props.listType==='multiple'?
						<React.Fragment>
							<input className='input__group__field typo__body' type={'text'} value={props.value.join(', ')} readOnly required onClick={()=>setShowValues(true)}/>
							<Backdrop show={ShowValues}>
								<InputModal listType={props.listType} minLimit={props.minLimit} maxLimit={props.maxLimit} value={props.value} values={props.values} label={props.label} onSave={values=>{props.onSave(values); setShowValues(false)}} onCancel={()=>setShowValues(false)}/>
							</Backdrop>
						</React.Fragment>
						:
						<React.Fragment>
							<input className='input__group__field typo__body' type={'text'} value={props.value} readOnly required onClick={()=>setShowValues(true)}/>
							<Backdrop show={ShowValues}>
								<InputModal listType={props.listType} minLimit={props.minLimit} maxLimit={1} value={1} values={props.values} label={props.label} onSave={value=>{props.onSave(value); setShowValues(false)}} onCancel={()=>setShowValues(false)}/>
							</Backdrop>
						</React.Fragment>}
				</React.Fragment>
			default:
				return <input className='input__group__field typo__body' type={'text'} required value={props.value} onChange={props.onChange}/>
		}
	}

	return (
		<div className='input__group'>
			{renderInputField()}
			<div className='input__group__label'>
				<p className='input__group__label__container typo__body'>{props.label}</p>
			</div>
		</div>
	)
}

export default InputField