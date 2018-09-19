/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

/* ===== Persist data with LevelDB ===============================
|  Learn more: leveldb: https://github.com/brix/Level/level  |
|  =========================================================*/

const leveldb = require('./levelSandbox');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = []
		this.errorLog = []	
    this.getBlockHeight()
      .then((height) => {
        if (height === -1) {
          this.addBlock(new Block("First block in the chain - Genesis block"));
        }
      })
  }

  // Add new block
  async addBlock(newBlock){
    console.log('\naddBlock start', newBlock.body)
    // Block height
    const height = await this.getBlockHeight()
    newBlock.height = height + 1;
    console.log('newBlock.height:', newBlock.height)
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 0){
      const prevBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = prevBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    leveldb.addLevelDBData(newBlock.height, JSON.stringify(newBlock))
      .then((result) => console.log(result))
      .catch((err) => console.log(err))
  }

  // Get block height
    async getBlockHeight(){
      const height = await leveldb.getBlockHeight();
      console.log('block height:', height)
      return height;
    }

    // get block
    async getBlock(blockHeight){
      // return object as a single string
      let block = '';
      await leveldb.getLevelDBData(blockHeight)
        .then((value) => block = value)
        .catch((err) => console.log('getBlock error:', err))
      return JSON.parse(block);
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash!==validBlockHash) {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        this.errorLog.push(blockHeight)
      }
    }

   // Validate blockchain
    async validateChain(){
      this.errorLog = [];
      let totalBlockHeight = await this.getBlockHeight()
      for (let i = 0; i < totalBlockHeight; i++) {
        // validate block
        this.validateBlock(i)

        if (i === totalBlockHeight - 1) {
          // compare blocks hash link
          let block = await this.getBlock(i)
          let nextBlock = await this.getBlock(i+1)
          if (block.blockHash!==nextBlock.previousHash) {
            this.errorLog.push(i);
          }
        }
      }
      
      if (this.errorLog.length>0) {
        console.log('Block errors = ' + this.errorLog.length);
        console.log('Blocks: ' + this.errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

let blockchain = new Blockchain();

// Test for 
(function theLoop (i) {
  setTimeout(function () {
    let height = blockchain.getBlockHeight()
    if (height == -1) theLoop(i);
    else {
      test();
    }
  }, 100);
})(10);

function test() {
  blockchain.addBlock(new Block("test data " + 1))
    .then(() => blockchain.addBlock(new Block("test data " + 2))
    .then(() => blockchain.addBlock(new Block("test data " + 3)))
    .then(() => blockchain.addBlock(new Block("test data " + 4)))
    .then(() => blockchain.addBlock(new Block("test data " + 5)))
    .then(() => blockchain.addBlock(new Block("test data " + 6)))
    .then(() => blockchain.addBlock(new Block("test data " + 7)))
    .then(() => blockchain.addBlock(new Block("test data " + 8)))
    .then(() => blockchain.addBlock(new Block("test data " + 9)))
    .then(() => {
        console.log('\nvalidate chain')
        blockchain.validateChain();
      })
  )
}

function getBlockchain() {
	return blockchain;
}

module.exports = {
	getBlockchain: getBlockchain
};
