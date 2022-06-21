
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar,faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';



function Rating (props) {

    const {rating,numReviews, caption} = props;
    return(
        <div className="rating">
            <span>
                {rating >= 1 
                    ? 
                    <FontAwesomeIcon  icon={faStar} />
                    : rating >= 0.5 
                    ?
                    <FontAwesomeIcon  icon={faStarHalfStroke} />
                    : 
                    <FontAwesomeIcon  icon={faStarRegular} />
                }
            </span>
            <span>
                {rating >= 2
                    ? 
                    <FontAwesomeIcon  icon={faStar} />
                    : rating >= 1.5 
                    ?
                    <FontAwesomeIcon  icon={faStarHalfStroke} />
                    : 
                    <FontAwesomeIcon  icon={faStarRegular} />
                }
            </span>
            <span>
                {rating >= 3
                    ? 
                    <FontAwesomeIcon  icon={faStar} />
                    : rating >= 2.5 
                    ?
                    <FontAwesomeIcon  icon={faStarHalfStroke} />
                    : 
                    <FontAwesomeIcon  icon={faStarRegular} />
                }
            </span>
            <span>
                {rating >= 4
                    ? 
                    <FontAwesomeIcon  icon={faStar} />
                    : rating >= 3.5 
                    ?
                    <FontAwesomeIcon  icon={faStarHalfStroke} />
                    : 
                    <FontAwesomeIcon  icon={faStarRegular} />
                }
            </span>
            <span>
                {rating >= 5
                    ? 
                    <FontAwesomeIcon  icon={faStar} />
                    : rating >= 4.5 
                    ?
                    <FontAwesomeIcon  icon={faStarHalfStroke} />
                    : 
                    <FontAwesomeIcon  icon={faStarRegular} />
                }
            </span>
            {caption ? (
                <span>{caption}</span>
            ) : (
                <span>{' ' + (numReviews === 1) ? numReviews + ' recenzie' :  numReviews +  'recenzii'}</span>
            )}
        </div>
    );
}
export default Rating;
