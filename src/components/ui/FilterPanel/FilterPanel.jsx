import Button from "../Buttons/Button"
import Accordian from "../Accordian/Accordian"

const FilterPanel = ({ config={}, filters=[], setFilters=()=>{}, defaults }) => {

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
            options.push(<div key={item.value} className="filter-panel__body__item">
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
            options.push(<div key={item.value} className="filter-panel__body__item">
                <label>
                    <input type="radio" name={filterData.name} onChange={(e)=>toggleFilter(e,filterData,item)} checked={currentValue === item.value}/>
                    <span>{item.label}</span>
                </label>
            </div>)
        })
        return <Accordian classNames="filter-panel__body__accordian" key={filterData.name} header={filterData.label} options={options}/> ;
    }

    const renderTab = (filterData) => {
		const currentValue = filters.filter(filter => filter['key'] === filterData.name)[0].value
        return <div className="filter-panel__body__tabs">
            {filterData.values.map(item => (<Button key={item.name} onClick={(e)=>toggleFilter(e,filterData,item)} className={"filter-panel__body__tabs__item " + (currentValue === item.value?"filter-panel__body__tabs__item--active":"") }>{item.label}</Button>))}
        </div>
    }

    const renderRange = (filterData) => {
		const currentValue = filters.filter(filter => filter['key'] === filterData.name)[0].value
        return <div className="filter-panel__body__range">
            <div className="filter-panel__body__range__header">
                <div className="filter-panel__body__range__label typo__head typo__head--6">{filterData.label}</div>
                <div className="filter-panel__body__range__value">{currentValue} {filterData.unit}</div>
            </div>
            <div className="filter-panel__body__range__body">
                <input defaultValue={filterData.default} onChange={(e)=>setFilterValue(filterData,e.target.value)} type="range" min={filterData.min||0} max={filterData.max||100} step={filterData.step||1} />
            </div>
        </div>
    }

    return ( 
        <div className="filter-panel">
            <div className="filter-panel__header">
                <div className="typo__head--6 typo__color--n600">Filters</div>
                <Button onClick={clearFilters}>clear</Button>
            </div>
            <div className="filter-panel__body">
                {
                    config.map(filterItem => {
                        switch(filterItem.type) {
                            case "multiselect" : return renderMultiselect(filterItem) ;
                            case "select" : return renderSelect(filterItem) ;
                            case "tab" : return renderTab(filterItem) ;
                            case "range" : return renderRange(filterItem) ;
                            default : return "" ;
                        }
                    })
                }
            
            </div>
        </div> 
    );
}

export default FilterPanel;