import NavBar from './NavBar';

const Dashboard = () => {
    return (
        <div>
            <NavBar loggedIn={true} />
            <span>DASHBOARD</span>
        </div>
    )
}

export default Dashboard;