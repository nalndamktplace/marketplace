import React from 'react'
import { useDispatch, useSelector } from "react-redux"

import Button from '../Buttons/Button'

import { SET_DARKMODE, SET_LIGHTMODE } from "../../../store/actions/darkmode"

import { ReactComponent as SunIcon } from "../../../assets/icons/sun.svg"
import { ReactComponent as MoonIcon } from "../../../assets/icons/moon.svg"

const DarkModeSwitch = () => {
	let DarkModeState = useSelector((state) => state.DarkModeState)
	const dispatch = useDispatch()

	const handleSwitchToggle = () => {
		if (DarkModeState.darkmode === true) dispatch({ type: SET_LIGHTMODE })
		else dispatch({ type: SET_DARKMODE })
	}

	return (
		<Button onClick={handleSwitchToggle}>
			{DarkModeState.darkmode ? <SunIcon /> : <MoonIcon />}
		</Button>
	)
}

export default DarkModeSwitch
