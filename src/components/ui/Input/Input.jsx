import React from 'react'

const InputField = props => {

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
			case 'password':
				return <input className='input__group__field typo__body' type={'password'} required value={props.value} onChange={props.onChange}/>
			case 'telephone':
				return <input className='input__group__field typo__body' type={'tel'} required value={props.value} onChange={props.onChange}/>
			case 'file':
				return <input className='input__group__field typo__body' type={'file'} accept={props.file} required onChange={props.onChange}/>
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