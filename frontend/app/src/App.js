import './App.css';

function App() {

  const handleClick = () => {
    fetch("http://localhost:8080/validate").then(res => {
      console.log('jhello ', res);
    })
  }
  return (
    <div className="App">
      <button onClick={handleClick}>Test</button>
    </div>
  );
}

export default App;
