const Lottery = artifacts.require("Lottery");
const assertRevert =require('./assertRevert');
const expectEvent =require('./expectEvent');


// 가나슈 0,1,2 계좌
contract('Lottery',function([deplyer, user1 ,user2]){
    let lottery;
    let betAmount = 5*10**15;
    beforeEach(async ()=> {

        //이걸 통해 배포?
        lottery = await Lottery.new();
    })

    it('getPot should return current pot', async () => {
        let pot= await lottery.getPot();
        assert.equal(pot,0);

    })


    describe('Bet', function (){
        it('should fail when money is not enough', async () => {
            await lottery.bet('0xab',{from : user1, value:betAmount})
            
        })
        it('bet queue', async () => {
            //bet
            let receipt =await lottery.bet('0xab',{from : user1, value:betAmount})
            
            let pot = await lottery.getPot();
            assert.equal(pot,0);

            //check 0.005
            let contractBalance = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalance,betAmount);


            //check bet info
            let currentBlcokNumber = await web3.eth.getBlockNumber();
            let bet = await lottery.getBetInfo(0);
            assert.equal(bet.answerBlockNumber,currentBlcokNumber +3);
            assert.equal(bet.bettor, user1);
            assert.equal(bet.challenges, '0xab');

            //check log
            //await expectEvent.inLogs(receipt.logs , 'BET')
    
        })
    })

    
});