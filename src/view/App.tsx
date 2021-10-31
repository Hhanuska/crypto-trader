import React from 'react';
import logo from './logo.svg';
import './App.css';

import { test, test2 } from '../index';

interface TestFormState {
  symbol: string;
  interval: string;
  limit: number;
}

class TestForm extends React.Component {

  state: TestFormState;

  constructor(props: any) {
    super(props);

    this.state = {
      symbol: '',
      interval: '',
      limit: 10
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({
      symbol: event.target.symbol,
      interval: event.target.interval,
      limit: event.target.limit
    });
  }

  async handleSubmit(event: any) {
    await test2(this.state.symbol, this.state.interval, this.state.limit);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
            Symbol:
            <input type="text" name="symbol" id="symbol" value={this.state.symbol} onChange={this.handleChange} required />
          </label>
          <label>
            Interval:
            <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange} required />
          </label>
          <label>
            Limit:
            <input type="number" name="limit" id="limit" value={this.state.limit} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Request" />
      </form>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick = {test}>Test</button>
        {/* <TestForm/> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
