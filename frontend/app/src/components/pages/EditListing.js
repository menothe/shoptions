import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ListingContext from '../../state_management/ListingContext';
import NavBar from '../NavBar';

const EditListing = () => {
    const { listings, setListings } = useContext(ListingContext);
    const { ListingID } = useParams();

    return (
        <div>
            <NavBar loggedIn={true} />
            <span>{ListingID}</span>
        </div>
    );
}

export default EditListing;