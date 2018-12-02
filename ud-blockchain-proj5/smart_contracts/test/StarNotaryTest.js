const starDefinition = artifacts.require('StarNotary')

contract('StarNotary', accounts => {
    const name = 'Hyunjae Awesome Star!'
    const story = 'This is my first star'
    const ra = 'ra_032.155'
    const dec = 'dec_121.874'
    const mag = 'mag_245.978'

    let defaultAccount = accounts[0];
    let account1 = accounts[1];
    let account2 = accounts[2];
    let starPrice = web3.toWei(0.01, "ether")

    beforeEach(async function() {
        this.contract = await starDefinition.new({from: defaultAccount});
    });

    describe('Star creation and read tests...', () => {
        it('Can create a star and read star info', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: defaultAccount});
            assert.deepEqual(await this.contract.tokenIdToStarInfo(1), ['Hyunjae Awesome Star!', 'This is my first star', 'ra_032.155', 'dec_121.874', 'mag_245.978']);
        });
    });

    describe('Sell and List Stars for Sale', () => {
        it('Account1 can put for their star for sale', async function () {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: account1});
            assert.equal(await this.contract.ownerOf(1), account1);
            await this.contract.putStarUpForSale(1, starPrice, {from: account1});
            assert.equal(await this.contract.starsForSale(1), starPrice);
        });

        it('Account1 can put up their star for sale', async function() {
            await this.contract.createStar('Jiyoung star1', 'ra_1.0', 'dec_1.0', 'mag_1.0', 'Jiyoung story 1', 1, {from: account1});
            await this.contract.createStar('Jiyoung star2', 'ra_2.0', 'dec_2.0', 'mag_2.0', 'Jiyoung story 2', 2, {from: account1});
            await this.contract.createStar('Jiyoung star3', 'ra_3.0', 'dec_3.0', 'mag_3.0', 'Jiyoung story 3', 3, {from: account1});
            await this.contract.putStarUpForSale(1, starPrice, {from: account1});
            await this.contract.putStarUpForSale(3, starPrice, {from: account1});
            let stars = await this.contract.allStarsForSale();
            assert.equal(stars.length, 2);
            let starList = [];
            for (i in stars) {
                starList.push(stars[i].c[0]);
            }
            assert.deepEqual(starList, [1, 3]);
        });
    });

    describe('Check if star exists', () => {
        if('Star already exsits...', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: defaultAccount});
            assert.equal(await this.contract.checkIfStarExist('ra_032.155', 'dec_121.874', 'mag_245.978'), true);
        });
    });

    describe('Account2 can buy star from Account1', () => {
        it('Account2 us the owner of the star after they buy it', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: account1});
            assert.equal(await this.contract.ownerOf(1), account1);
            await this.contract.putStarUpForSale(1, starPrice, {from: account1});
            await this.contract.buyStar(1, {from:account2, value: starPrice, gasPrice: 0})
            assert.equal(await this.contract.ownerOf(1), account2)
        });

        it('Account2 ether balance changed correctly', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: account1});
            assert.equal(await this.contract.ownerOf(1), account1);
            await this.contract.putStarUpForSale(1, starPrice, {from: account1});

            let overpaidAmount = web3.toWei(0.05, 'ether');
            const balanceBeforeTx = web3.eth.getBalance(account2);
            await this.contract.buyStar(1, {from: account2, value: overpaidAmount, gasPrice: 0});
            const balanceAfterTx = web3.eth.getBalance(account2);
            assert.equal(balanceBeforeTx.sub(balanceAfterTx), starPrice);
        });
    });

    describe('Testing approve', () => {
        it('approve and getApproved', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: defaultAccount});
            await this.contract.approve(account1, 1, {from: defaultAccount});
            assert.equal(await this.contract.getApproved(1, {from: defaultAccount}), account1);
        });
    });

    describe('Testing setApprovalForAll', () => {
        if('setApprovalForAll and isApprovedForAll', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: defaultAccount});
            await this.contract.setApprovalForAll(account1, 1);
            assert.equal(await this.contract.isApprovalForAll(defaultAccount, account1, {from: defaultAccount}), true);
        });
    });

    describe('Testing safeTransferFrom', () => {
        if('safeTransfer', async function() {
            await this.contract.createStar(name, ra, dec, mag, story, 1, {from: defaultAccount});
            await this.contract.safeTransferFrom(defaultAccount, account1, 1)
            assert.equal(await this.contract.owner(1, {from: defaultAccount}), account1);
        });
    });
});