import StarEmptyIcon from "../../../assets/icons/star-empty.svg"
import StarFilledIcon from "../../../assets/icons/star-filled.svg"
import StarFilledHalfIcon from "../../../assets/icons/star-filled-half.svg"
import StarEmptyHalfRtlIcon from "../../../assets/icons/star-empty-half-rtl.svg"

const Stars = ({rating,size}) => {
    const renderStars = (rating) => {
        let starsDOM = []
        for (let i = 1; i <= 5; i++) {
            if (i <= rating)
                starsDOM.push(
                    <div key={"STAR" + i} className="stars__star">
                        <img src={StarFilledIcon} alt="star" className="stars__star__icon" />
                    </div>
                )
            else if (rating < i && rating > i - 1)
                starsDOM.push(
                    <div key={"STAR" + i} className="stars__star">
                        <img src={StarFilledHalfIcon} alt="half star" className="stars__star__icon stars__star__icon--half" />
                        <img src={StarEmptyHalfRtlIcon} alt="half star" className="stars__star__icon stars__star__icon--half" />
                    </div>
                )
            else
                starsDOM.push(
                    <div key={"STAR" + i} className="stars__star">
                        <img src={StarEmptyIcon} alt="empty star" className="stars__star__icon" />
                    </div>
                )
        }
        return starsDOM
    }

    const getClasses = () => {
        let classList = ["stars"]
        if(size==="small") classList.push("stars--small")
        return classList.join(" ")
    }

    return <div className={getClasses()}>{renderStars(rating)}</div>
}

export default Stars
