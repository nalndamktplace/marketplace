import Button from "../Buttons/Button"
import Accordian from "../Accordian/Accordian"
import {ReactComponent as CloseIcon} from "../../../assets/icons/close-icon.svg" ;

const FilterPanel = ({ config={}, maxPrice=100,filters=[], setFilters=()=>{}, defaults,setFiltersPanelOpen }) => {

    const toggleFilter = (e, filterItem, item) => {
		if(filterItem.type === "multiselect") {
			let activeFilter = filters.filter(filter => filter['key'] === filterItem.name)[0]
			if(activeFilter.value.indexOf(item.value)>-1){
				const oldFilters = filters.filter(filter => filter['key'] !== filterItem.name)
				const newValues = activeFilter.value.filter(v => v !== item.value)
				setFilters([...oldFilters, {key: filterItem.name, value: newValues, type: filterItem.type}])
			}
			else{
				const oldFilters = filters.filter(filter => filter['key'] !== filterItem.name)
				const newValues = [...activeFilter.value, item.value]
				setFilters([...oldFilters, {key: filterItem.name, value: newValues, type: filterItem.type}])
			}
		}
		else{
			const activeFilter = filters.filter(filter => filter['key'] === filterItem.name)[0]
			if(activeFilter.value === item.value){
				const oldFilters = filters.filter(filter => filter['key'] !== filterItem.name)
				setFilters([...oldFilters, {key: filterItem.name, value: null, type: filterItem.type}])
			}
			else{
				const oldFilters = filters.filter(filter => filter['key'] !== filterItem.name)
				setFilters([...oldFilters, {key: filterItem.name, value: item.value, type: filterItem.type}])
			}
		}
    }

    const setFilterValue = (filterItem,value) => {
		const oldFilters = filters.filter(filter => filter['key'] !== filterItem.name)
		setFilters([...oldFilters, {key: filterItem.name, value: value, type: filterItem.type}])
	}

    const clearFilters = () => { setFilters(()=>(defaults)) }

    const renderMultiselect = (filterData) => {
        let options = []
		const currentValues = filters.filter(filter => filter['key'] === filterData.name)[0].value
        filterData.values.forEach(item => {
            options.push(<div key={item.value} className="filter-panel__body__item typo__body">
                <label>
                    <input type="checkbox" onChange={(e)=>toggleFilter(e,filterData,item)} checked={currentValues.indexOf(item.value)>-1}/>
                    <span>{item.label}</span>
                </label>
            </div>)
        })
        return <Accordian classNames="filter-panel__body__accordian" key={filterData.name} header={filterData.label} options={options}/>
    }

    const renderSelect = (filterData) => {
        let options = []
		const currentValue = filters.filter(filter => filter['key'] === filterData.name)[0].value
        filterData.values.forEach(item => {
            options.push(<div key={item.value} className="filter-panel__body__item typo__body">
                <label>
                    <input type="radio" name={filterData.name} onChange={(e)=>toggleFilter(e,filterData,item)} checked={currentValue === item.value}/>
                    <span>{item.label}</span>
                </label>
            </div>)
        })
        return <Accordian classNames="filter-panel__body__accordian" key={filterData.name} header={filterData.label} options={options}/>
    }

    const renderTab = (filterData) => {
		const currentValue = filters.filter(filter => filter['key'] === filterData.name)[0].value
        return <div className="filter-panel__body__tabs" key={filterData.name}>
            {filterData.values.map(item => (<Button key={item.name} onClick={(e)=>toggleFilter(e,filterData,item)} className={"filter-panel__body__tabs__item " + (currentValue === item.value?"filter-panel__body__tabs__item--active":"") }>{item.label}</Button>))}
        </div>
    }

    const renderRange = (filterData) => {
		const currentValue = filters.filter(filter => filter['key'] === filterData.name)[0].value
        const maxValue = (filterData.name==="price"?maxPrice:filterData.max)||100 ;
        const minValue = filterData.min||0 ;
        const steps =(Math.round((maxValue - minValue)/50)*5) || 1;
        return <div className="filter-panel__body__range" key={filterData.name}>
            <div className="filter-panel__body__range__header">
                <div className="filter-panel__body__range__label typo__subtitle">{filterData.label}</div>
                <div className="filter-panel__body__range__value">{currentValue} {filterData.unit}</div>
            </div>
            <div className="filter-panel__body__range__body">
                <input defaultValue={filterData.default} onChange={(e)=>setFilterValue(filterData,e.target.value)} type="range" min={minValue} max={maxValue} step={steps} />
            </div>
        </div>
    }

    return ( 
        <div className="filter-panel">
            <div className="filter-panel__header">
                <div className="typo__head typo__head--6 typo__color--n600 filter-panel__header__title">Filters</div>
                <Button className="filter-panel__header__close-btn" type="icon" onClick={()=>{setFiltersPanelOpen(false)}}><CloseIcon /></Button>
            </div>
            <div className="filter-panel__body">
                {
                    config.map(filterItem => {
                        switch(filterItem.type) {
                            case "multiselect" : return renderMultiselect(filterItem)
                            case "select" : return renderSelect(filterItem)
                            case "tab" : return renderTab(filterItem)
                            case "range" : return renderRange(filterItem)
                            default : return ""
                        }
                    })
                }
            </div>
            <div className="filter-panel__fab">
                <Button type="primary" onClick={clearFilters}>CLEAR</Button>
            </div>
        </div> 
    )
}

export default FilterPanel