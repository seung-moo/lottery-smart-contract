//artifacts.require build에 있는 json 파일 가져옴
const Lottery = artifacts.require("Lottery");

module.exports = function (deployer) {
  deployer.deploy(Lottery);
};
