import { useEffect } from "react"

import Button from "../components/ui/Buttons/Button"

import GaTracker from '../trackers/ga-tracker'

import {ReactComponent as Icon} from "../assets/icons/wallet.svg"

const InterfaceDebugPage = () => {

	useEffect(() => { GaTracker('page_view_debug') }, [])

    return (
        <div className="debug">
            <section className="debug__typography">
                <div className="typo__head">This is a Sample Text</div>
                <div className="typo__head typo__head--2">This is a Sample Text</div>
                <div className="typo__head typo__head--3">This is a Sample Text</div>
                <div className="typo__head typo__head--4">This is a Sample Text</div>
                <div className="typo__head typo__head--5">This is a Sample Text</div>
                <div className="typo__head typo__head--6">This is a Sample Text</div>
                <div className="typo__body">This is a Sample Text</div>
                <div className="typo__body typo__body--2">This is a Sample Text</div>
                <div className="typo__body typo__body--3">This is a Sample Text</div>
            </section>
            <section className="debug__buttons">
            <div className="debug__buttons__row">
                    <Button size="sm"><Icon />Button</Button>
                    <Button size="md"><Icon />Button</Button>
                    <Button size="lg"><Icon />Button</Button>
                    <Button size="xl"><Icon />Button</Button>
                </div>
                <div className="debug__buttons__row">
                    <Button type="primary" size="sm"><Icon />Button</Button>
                    <Button type="primary" size="md"><Icon />Button</Button>
                    <Button type="primary" size="lg"><Icon />Button</Button>
                    <Button type="primary" size="xl"><Icon />Button</Button>
                </div>
                <div className="debug__buttons__row">
                    <Button type="secondary" size="sm"><Icon />Button</Button>
                    <Button type="secondary" size="md"><Icon />Button</Button>
                    <Button type="secondary" size="lg"><Icon />Button</Button>
                    <Button type="secondary" size="xl"><Icon />Button</Button>
                </div>
                <div className="debug__buttons__row" style={{background:"linear-gradient(45deg,black,white)"}}>
                    <Button type="white" size="sm"><Icon />Button</Button>
                    <Button type="white" size="md"><Icon />Button</Button>
                    <Button type="white" size="lg"><Icon />Button</Button>
                    <Button type="white" size="xl"><Icon />Button</Button>
                </div>
                <div className="debug__buttons__row">
                    <Button type="outline-primary" size="sm"><Icon />Button</Button>
                    <Button type="outline-primary" size="md"><Icon />Button</Button>
                    <Button type="outline-primary" size="lg"><Icon />Button</Button>
                    <Button type="outline-primary" size="xl"><Icon />Button</Button>
                </div>
                <div className="debug__buttons__row">
                    <Button type="outline-secondary" size="sm">Button</Button>
                    <Button type="outline-secondary" size="md">Button</Button>
                    <Button type="outline-secondary" size="lg">Button</Button>
                    <Button type="outline-secondary" size="xl">Button</Button>
                </div>
                <div className="debug__buttons__row" style={{background:"linear-gradient(45deg,black,white)"}}>
                    <Button type="outline-white" size="sm">Button</Button>
                    <Button type="outline-white" size="md">Button</Button>
                    <Button type="outline-white" size="lg">Button</Button>
                    <Button type="outline-white" size="xl">Button</Button>
                </div>
            </section>
        </div>
    )
}

export default InterfaceDebugPage
