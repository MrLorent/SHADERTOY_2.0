import createElement from './createElement.jsx';

// Setup some data
const name = 'Geoff'
const friends = ['Sarah', 'James', 'Hercule']

// Create some dom elements
export const app = (
<div className="app">
    <h1 className="title"> Hello, world! </h1>
    <p> Welcome back, {name} </p>
    <p>
        <strong>Your friends are:</strong>
    </p>
    <ul>
        {friends.map(name => (
            <li>{name}</li>
        ))}
    </ul>
</div>
)