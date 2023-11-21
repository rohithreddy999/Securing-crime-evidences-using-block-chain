import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import Web3 from 'web3'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      accountBalance: 0,
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
 
    this.setState({ loading: false })
  }



  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }



  

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts })
        // Get the value from the contract to prove it worked.
        // return this.simpleStorageInstance.get.call(accounts[2])
        return this.simpleStorageInstance.get.call(this.account)
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    var caseno = document.getElementById('caseno').value
    console.log("Case Number :"+caseno)
    var casename = document.getElementById('casename').value
    console.log("Case Name :"+casename)
    var description = document.getElementById('description').value
    console.log("Case Details :"+description)
    console.log('Account Address :',this.state.account);

    ipfs.files.add(this.state.buffer, (error, result) => {
      console.log(result)
      if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash,caseno,casename,description,{ from: this.state.account[0] }).then((r) => {
        console.log(r);
        return this.setState({ ipfsHash: result[0].hash })
        // console.log('ifpsHash', this.state.ipfsHash)
      })
    })
  }

  
  
  render() {
    
    return (
      <div className="App">
            <div id="header">
              <img src="logo.png" id="logo"></img>
              <h2 id="logoname">Secure Crime Evidence</h2>
            <div id="header-right">
             
              <a href="http://localhost:3000/">Department Login</a>
              <a href="./about.html">About</a>
              <a id="active" href="home.html">Home</a>
              
            </div>
            <h3 id="address">Account Address : {this.state.account}</h3>
             
          </div>

          <section id="container">
                <div class="container">
                  <form onSubmit={this.onSubmit}> 
                      <div id="row">
                        <div id="col-25">
                          <label>Case Number</label>
                        </div>
                        <div id="col-75">
                          <input type="text" id="caseno" />
                        </div>
                      </div> 

                      <div id="row">
                        <div id="col-25">
                          <label>Case Name</label>
                        </div>
                        <div id="col-75">
                          <input type="text" id="casename" />
                        </div>
                      </div> 

                      

                      <div id="row">
                        <div id="col-25">
                          <label >Enter Description</label>
                        </div>
                        <div id="col-75">
                          <textarea name="description" id="description" />
                        </div>
                      </div> 

                      
                      <div id="row">
                        <div id="col-25">
                          <label>Add Evidence</label>
                        </div>
                        <div id="col-75">
                          <input type='file' onChange={this.captureFile} />
                         
                        </div>
                      </div>   
                      
                      <div id="row">
                        <div class="col-75">
                            <button type='submit'>Submit</button>
                        </div>
                      </div> 
                  </form>
                
                </div>
               
          </section>

          <section id="contents">
          <br></br>
          <br></br>
          <br></br>
                <table id="eth">
                    <tr>
                      <th>ETH Hash</th>
                      <th>Hash Value</th>
                    </tr>
                    <tr>
                      <td>IPFS Hash stored on Eth Contract </td>
                      <td>{this.state.ipfsHash}</td>
                       
                    </tr>
                    
                </table>
                <br></br>
                <br></br>
                <br></br>
                
             
           </section>
            
       </div>
    );
  }
}

export default App
