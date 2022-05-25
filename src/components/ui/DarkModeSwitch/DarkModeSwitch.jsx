import React from 'react'
import { useDispatch, useSelector } from "react-redux"

import IconButton from "../Buttons/IconButton"

import { ReactComponent as SunIcon } from "../../../assets/icons/sun.svg"
import { ReactComponent as MoonIcon } from "../../../assets/icons/moon.svg"
import { SET_DARKMODE, SET_LIGHTMODE } from "../../../store/actions/darkmode"

const DarkModeSwitch = () => {
	let DarkModeState = useSelector((state) => state.DarkModeState)
	const dispatch = useDispatch()

	const handleSwitchToggle = () => {
		if (DarkModeState.darkmode === true) dispatch({ type: SET_LIGHTMODE })
		else dispatch({ type: SET_DARKMODE })
	}

	return (
		<IconButton onClick={handleSwitchToggle} icon={DarkModeState.darkmode ? <SunIcon /> : <MoonIcon /> } />
	)
}

export default DarkModeSwitch
