window.addEventListener("load", start);
// api: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#id26
async function start() {
    try {
        if (typeof window.ethereum == 'undefined') {
            console.log('MetaMask is not installed!');
        } else {
            console.log('MetaMask is installed!');

            const getIpfsUrl = 'http://127.0.0.1:3000/ipfs';
            let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
            // window.ethereum
            await window.ethereum.send('eth_requestAccounts');
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(accounts)

            // contract address
            const contractAddress = '0x8e591522B0C7Bd4bdc5b72ec7DE8081eB32becdf'
            // contract abi
            const abi = [
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "hash",
                            "type": "bytes"
                        }
                    ],
                    "name": "newDocument",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "success",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "creator",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "hash",
                            "type": "bytes"
                        }
                    ],
                    "name": "documentExists",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "exists",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "name": "documentHashMap",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "hash",
                            "type": "bytes"
                        }
                    ],
                    "name": "getDocument",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getNumDocs",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "numDocs",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "numDocuments",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
            
            this.ipfs = await window.Ipfs.create()
            const myContract = new web3.eth.Contract(abi, contractAddress);

            const getNumDocsButton = document.querySelector('.getNumDocs');
            const numDocsText = document.querySelector('.numDocs');

            getNumDocsButton.addEventListener('click', () => {
                myContract.methods.getNumDocs().call()
                .then( r => {
                    // console.log(r);
                    numDocsText.textContent = r;
                
                });
            });

            // ex: 0x7465737400000000000000000000000000000000000000000000000000000000
            const getDocumentButton = document.querySelector('.getDocument');
            const docInfoText = document.querySelector('.docInfo');
            const docOwnerText = document.querySelector('.docOwner');

            getDocumentButton.addEventListener('click', () => {
                var getDocumentVal = document.querySelector('.getDocumentVal').value;
                myContract.methods.getDocument(getDocumentVal).call()
                .then( r => {

                    var date = new Date(parseInt(r.date));
                    var t = date.getFullYear()+
                        "/"+(date.getMonth()+1)+
                        "/"+date.getDate()+
                        " "+date.getHours()+
                        ":"+date.getMinutes()+
                        ":"+date.getSeconds();
                    docInfoText.textContent = t;
                    docOwnerText.textContent = r.owner;
                });
            });
            
            const checkDocumentExistsButton = document.querySelector('.checkDocumentExists');
            const docExistsText = document.querySelector('.docExists');

            checkDocumentExistsButton.addEventListener('click', () => {
                var checkDocumentExistsVal = document.querySelector('.checkDocumentExistsVal').value;
                myContract.methods.documentExists(checkDocumentExistsVal).call()
                .then( r => {
                    // console.log(r);
                    docExistsText.textContent = r;
                });
            });

            const uploadFileButton = document.querySelector('.uploadFile');
            const transcationStatusText = document.querySelector('.transcationStatus');
            const bytesHashText = document.querySelector('.bytesHash');

            uploadFileButton.addEventListener('click', () => {
                var uploadFileVal = document.querySelector('.uploadFileVal').value;
                // console.log(uploadFileVal)
                var hashCode = web3.utils.asciiToHex(uploadFileVal); // base58 to bytes
                // console.log(hashCode)
                myContract.methods.newDocument(hashCode)
                .send({from: accounts[0]})
                .on('sending', function(confirmationNumber, receipt){
                    transcationStatusText.textContent = 'sending';
                })
                .on('receipt', function(receipt){
                    transcationStatusText.textContent = 'completed';
                    bytesHashText.textContent = hashCode;
                })
                .on('error', function(error, receipt) {
                    transcationStatusText.textContent = 'error';
                    console.log(error);
                });
            });
            
            // QmXk9aJuWS4Zucc9LYQYfyquhShCGvsHteENuJtJUQDkmr
            // const downloadFileButton = document.querySelector('.downloadFile');
            // downloadFileButton.addEventListener('click', () => {
            //     var downloadFileVal = document.querySelector('.downloadFileVal').value;
            //     console.log(downloadFileVal);
            //     // downloadFileVal = web3.utils.hexToAscii(downloadFileVal)
            //     // console.log(downloadFileVal)
            //     fetch("ipfs/"+downloadFileVal,{
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         method: 'GET'
            //     })
            //     .then(res => {
            //         return res.json();
            //     })
            //     .then(r => {
            //         console.log(r);
            //         let t = new Uint8Array(r.data);
            //         console.log(t)
            //         const blob = new Blob([new Uint8Array(r.data)]);
            //         console.log(blob)
            //         // downloadBlob(blob, this.fileTitle);
                    
            //     });
                
            // });
        }
    } catch(err) {
       console.error("Error:", err);
    }
}

async function uploadFile(file){

    try {
        const added = await this.ipfs.add(file, {
            progress: (prog) => console.log(`received: ${prog}`),
        });

        let hashCode = added.cid.toString();
        // console.log(hashCode);
        
        return hashCode
    } catch (err) {
        console.error(err);
    }
}

async function downloadFile(hash){
   
    try {
        let data = await this.ipfs.cat(hash, {
            progress: (prog) => console.log(`received: ${prog}`),
        });
        console.log(data);
        return data;
    } catch(err) {
        console.error(err);
    }
      
}