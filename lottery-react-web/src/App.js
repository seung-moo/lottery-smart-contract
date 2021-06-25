import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';

let lotteryAddress = '0x31c3e21b9Bca661472dfFa064844F89A7F9685A4';
let lotteryABI = [ { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x84f7e4f0" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event", "signature": "0x100791de9f40bf2d56ffa6dc5597d2fd0b2703ea70bc7548cd74c04f5d215ab7" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event", "signature": "0x8219079e2d6c1192fb0ff7f78e6faaf5528ad6687e69749205d87bd4b156912b" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event", "signature": "0x3b19d607433249d2ebc766ae82ca3848e9c064f1febb5147bc6e5b21d0adebc5" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event", "signature": "0x72ec2e949e4fad9380f9d5db3e2ed0e71cf22c51d8d66424508bdc761a3f4b0e" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event", "signature": "0x59c0185881271a0f53d43e6ab9310091408f9e0ff9ae2512613de800f26b8de4" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x403c9fa8" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xe16ea857" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xf4b46f5b" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe4fc6b6d" }, { "constant": false, "inputs": [ { "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x7009fa36" }, { "constant": true, "inputs": [ { "name": "challenges", "type": "bytes1" }, { "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function", "signature": "0x99a167d7" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "name": "answerBlockNumber", "type": "uint256" }, { "name": "bettor", "type": "address" }, { "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x79141f80" } ]

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      betRecords: [],
      winRecords: [],
      failRecords: [],
      pot: '0',
      challenges: ['A','B'],
      finalRecords: [{
        bettor: '0xabcd...',
        index:'0',
        challenges:'ab',
        answe:'ab',
        targetBlockNumber:'10',
        pot:'0'
      }]
    }
    

  }
  async componentDidMount() {
    await this.initWeb3();
    //await this.getBetEvents();
    //await this.getPot();
  }


  initWeb3 = async () => {
    if (window.ethereum) {
      console.log('Recent mode')
      this.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          // this.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
          console.log(`User denied account access error : ${error}`)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacy mode')
      this.web3 = new Web3(Web3.currentProvider);
      // Acccounts always exposed
      // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  

  let accounts = await this.web3.eth.getAccounts();
  this.account = accounts[0];

  this.lotteryContract =new this.web3.eth.Contract(lotteryABI, lotteryAddress);


  }
  // getPot = async () =>{
  //   let pot =await this.lotteryContract.methods.getPot.call();
  //   let potString= this.web3.utils.fromWei(pot.toString(),'ether');
  //   this.setState({pot:potString})
  // }
  getBetEvents = async () => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents('BET', {fromBlock :0 , toBlock: 'latest'})
    console.log(events);
  }

  bet = async () => {
    let challenges ='0x' + this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();
    let nonce = await this.web3.eth.getTransactionCount(this.account);
    this.lotteryContract.methods.betAndDistribute(challenges).send({from:this.account, value:500000000000000, gas:3000000, nonce:nonce})


  }
  //pot money

  // 
  // Bet button
  // history 
  onClickCard = (_Charcter) => {
    this.setState({
      challenges : [this.state.challenges[1], _Charcter]
    })
  } 
  getCard= (_Charcter, _cardStyle) => {
    let _card='';
    if(_Charcter === 'A'){
      _card='🂡	';
    }
    if(_Charcter === 'B'){
      _card='🂱';
    }
    if(_Charcter === 'C'){
      _card='🃁';
    }
    if(_Charcter === 'D'){
      _card='🃑';
    }
    return (
      <button className={_cardStyle} onClick ={() => {
          this.onClickCard(_Charcter)

      }}>
              <div className="card-body text-center">
              <p className="card-text"></p>
              <p className="card-text text-center" style={{fontSize:200}} >{_card}</p>
              <p className="card-text"></p>
              </div>
      </button>
    )
  }
  render() {
    return (
      <div className="App">
        
        <div className="Container"> 
          <div className="jumbotron">
           <h1>Current Pot: {this.state.pot}</h1> 
           <p>Lottery</p> 
           <p>Lottery tutorial</p>
           <p>Your Bet</p>
           <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
          </div>
        </div>
        <div className= "Contianer">
          <div className="card-group">
            {this.getCard('A', 'card bg-primary')}
            {this.getCard('B', 'card bg-warning')}
            {this.getCard('C', 'card bg-danger')}
            {this.getCard('D', 'card bg-success')}

          </div>
          <div className="Container">
            <button className="btn btn-danger btn-lg" onClick={this.bet}>BET</button>
          </div>
          <div ClassName="Container">
            <table className="table table-ark table-striped">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Address</th>
                  <th>challenge</th>
                  <th>Answer</th>
                  <th>Pod</th>
                  <th>State</th>
                  <th>answerBlockNumber</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.finalRecords.map((record, index) => {
                    return(
                      <tr key={index}>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    )
                  }) 
                }
              </tbody>
            </table>
          </div>

        </div>
        
      </div>
    );
  }
}
// index address challenge answer pot status answerBlockNumber
export default App;