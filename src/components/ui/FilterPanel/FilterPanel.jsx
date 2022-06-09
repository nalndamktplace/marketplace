import Accordian from "../Accordian/Accordian";
import { isUsable } from "../../../helpers/functions";
import Button from "../Buttons/Button";

const FilterPanel = ({config={},filters={},setFilters=()=>{}}) => {

    const toggleFilter = (e,filterItem,item) => {
        if(filterItem.type === "multiselect") {
            let oldValue = filters[filterItem.name] ;
            if(!isUsable(oldValue)) oldValue = [] ; 
            if(!e.target.checked){
                setFilters({...filters,[filterItem.name] : oldValue.filter(it => it != item.value)});
            } else {
                setFilters({...filters,[filterItem.name] : [...oldValue,item.value]});
            }
        } else {
            setFilters({...filters,[filterItem.name] : item.value});
        }
    }

    const setFilterValue = (filterItem,value) => {
        setFilters({...filters,[filterItem.name] : value});
    }

    const clearFilters = () => {
        setFilters(()=>({}));
    }

    const renderMultiselect = (filterData) => {
        let options = [] ;
        filterData.values.forEach(item => {
            options.push(<div key={item.value} className="filter-panel__body__item">
                <label>
                    <input type="checkbox" onChange={(e)=>toggleFilter(e,filterData,item)} checked={filters[filterData.name]?.includes(item.value)||false}/>
                    <span>{item.label}</span>
                </label>
            </div>)
        })
        return <Accordian classNames="filter-panel__body__accordian" key={filterData.name} header={filterData.label} options={options}/> ;
    }

    const renderSelect = (filterData) => {
        let options = [] ;
        filterData.values.forEach(item => {
            options.push(<div key={item.value} className="filter-panel__body__item">
                <label>
                    <input type="radio" name={filterData.name} onChange={(e)=>toggleFilter(e,filterData,item)} checked={filters[filterData.name]?.includes(item.value)||false}/>
                    <span>{item.label}</span>
                </label>
            </div>)
        })
        return <Accordian classNames="filter-panel__body__accordian" key={filterData.name} header={filterData.label} options={options}/> ;
    }

    const renderTab = (filterData) => {
        return <div className="filter-panel__body__tabs">
            {filterData.values.map(item => (<Button key={item.name} onClick={(e)=>toggleFilter(e,filterData,item)} className={"filter-panel__body__tabs__item " + (filters[filterData.name]===item.value?"filter-panel__body__tabs__item--active":"") }>{item.label}</Button>))}
        </div>
    }

    const renderRange = (filterData) => {
        return <div className="filter-panel__body__range">
            <div className="filter-panel__body__range__header">
                <div className="filter-panel__body__range__label typo__head typo__head--6">{filterData.label}</div>
                <div className="filter-panel__body__range__value">{filters[filterData.name]||0} USDC</div>
            </div>
            <div className="filter-panel__body__range__body">
                <input onChange={(e)=>setFilterValue(filterData,e.target.value)} type="range" min={filterData.min||0} max={filterData.max||100} step={filterData.step||1} />
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