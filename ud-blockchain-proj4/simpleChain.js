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

class Block {
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
    // add decoded story
    newBlock.body.star.storyDecoded = this.hex2ascii(newBlock.body.star.story);

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

    // Get block by height
    async getBlock(blockHeight){
      // return object as a single string
      let block = '';
      await leveldb.getLevelDBData(blockHeight)
        .then((value) => {
          block = value 
          if (block.height != 0) {
            block.body.star.storyDecoded = this.hex2ascii(block.body.star.story);
          }
        })
        .catch((err) => console.log('getBlock error:', err))
      return block;
    }

    // Get block by hash
    async getBlockByHash(blockHash) {
      // return object as a single string
      let block = '';
      await leveldb.getLevelDBDataByHash(blockHash)
        .then((value) => {
          block = value
          block.body.star.storyDecoded = this.hex2ascii(block.body.star.story);
        })
        .catch((err) => console.log('getBlock error:', err))
      return block;
    }

    // Get block by Address
    async getBlockByAddress(addr) {
      // return object as a single string
      let blocks = [];
      await leveldb.getLevelDBDataByAddress(addr)
        .then((value) => {
          blocks = value
          for (var i in blocks) {
            var block = blocks[i]
            //console.log('getBlockByAddress: ', block)
            block.body.star.storyDecoded = this.hex2ascii(block.body.star.story);
          }
        })
        .catch((err) => console.log('getBlock error:', err))
      return blocks;
    }

    // Validate block
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

    // Convert Hex to ASCII
    hex2ascii(hexx) {
      var hex = hexx.toString();//force conversion
      var str = '';
      for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
    } 
}

let blockchain = new Blockchain();

function getBlockchain() {
	return blockchain;
}

module.exports = {
	getBlockchain: getBlockchain,
	Block: Block
};
