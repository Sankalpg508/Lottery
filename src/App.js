import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    winner: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    // const winner = await lottery.methods.pickWinner().call();
    // console.log(winner);
    const balance = await web3.eth.getBalance(lottery.options.address);
    // console.log(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  // console.log(web3.version);
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    // console.log(accounts[0]);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have been entered!" });
  };
  onClick = async (event) => {
    // event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const winnerAddress = await lottery.methods.getWinner().call();
    // console.log(winner);

    // console.log(this.state.winner);
    this.setState({ message: "A winner has been picked!" });
    this.setState({ winner: winnerAddress });
  };
  render() {
    // web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4> Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />

        <h1>{this.state.message}</h1>
        <h1>{this.state.winner}</h1>
        {/* We use  web3.utils.fromWei to convert amount from wei to another and we use web3.utils.toWei to convert it to wei */}
      </div>
    );
  }
}

export default App;
