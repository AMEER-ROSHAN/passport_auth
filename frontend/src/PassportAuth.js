import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PassportCreate from './Create';
import PassportVerify from './verify';
import './passportAuth.css';

const PassportAuth = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isCreate, setIsCreate] = useState(true); 

  const contractAddress = '0x1971a71d3e6712619e6Ea5051A127c239c71ED0D';
  const contractABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'verifyPassportByAddress',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_passportNumber', type: 'uint256' },
        { name: '_name', type: 'string' },
        { name: '_country', type: 'string' },
        { name: '_issueDate', type: 'uint256' },
        { name: '_expiryDate', type: 'uint256' },
      ],
      name: 'createPassport',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'getOwnerPassports',
      outputs: [{ name: '', type: 'uint256[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ];
  

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        setAccount(accounts[0]);
      });

      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      alert('Please install MetaMask!');
    }
  }, []); // Empty dependency array to run once when component mounts

  const toggleView = (view) => {
    setIsCreate(view);
  };

  return (
    <div className="passport-auth-container">
      <h2 className="passport-auth-title">Passport Authentication</h2>
      
      {/* Buttons to toggle between Create and Verify views */}
      <div className="button-container">
        <button className="button" onClick={() => toggleView(true)}>Create Passport</button>
        <button className="button" onClick={() => toggleView(false)}>Verify Passport</button>
      </div>

      {/* Conditional rendering based on the selected view */}
      {isCreate ? (
        <PassportCreate web3={web3} account={account} contract={contract} />
      ) : (
        <PassportVerify contract={contract} account={account} />
      )}
    </div>
  );
};

export default PassportAuth;