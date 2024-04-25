import NavBar from './NavBar';
import FormDialog from './FormDialog';

const Dashboard = () => {
    const styles = {
        marginLeft: 20,
        marginTop: 20,
    }
    return (
        <div>
            <NavBar loggedIn={true} />
            <div style={{ ...styles }}>
                <h1>Listings</h1>
                <FormDialog />
            </div>
        </div>
    )
}

export default Dashboard;