import Accordian from "../Accordian/Accordian";
import {ReactComponent as FilterIcon} from "../../../assets/icons/filter.svg";
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
                            default : return "" ;
                        }
                    })
                }
            
            </div>
        </div> 
    );
}
 
export default FilterPanel;