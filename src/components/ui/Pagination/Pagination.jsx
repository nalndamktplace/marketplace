import Button from "../Buttons/Button";
import {ReactComponent as ChevronLeftIcon} from "../../../assets/icons/chevron-left.svg" ;
import {ReactComponent as ChevronRightIcon} from "../../../assets/icons/chevron-right.svg" ;

const Pagination = ({max=10,current=3,onPageChange=()=>{}}) => {

    const renderPageNumbers = () => {
        let pageNumbers = [] ;
        let minVisible = Math.max(1,Math.min(current-2,max-4));
        let maxVisible = Math.min(max,current + 2 + (3-current > 0?3-current:0)) ;
        for(let i=minVisible;i<=maxVisible;i++) 
            pageNumbers.push(<Button onClick={()=>onPageChange(i)} type={current===i?"secondary":""} className="pagination__button" key={"PAGE"+i+Math.random()}>{i}</Button>)
        return pageNumbers ;
    }

    const nextPage = () => {onPageChange(Math.min(max,current+1))};
    const prevPage = () => {onPageChange(Math.max(1,current-1))};

    return ( 
        <div className="pagination">
            <Button className="pagination__nav" onClick={prevPage}><ChevronLeftIcon/><span>Prev</span></Button>
            {renderPageNumbers()}
            <Button className="pagination__nav" onClick={nextPage}><span>Next</span><ChevronRightIcon/></Button>
        </div> 
    );
}
 
export default Pagination;