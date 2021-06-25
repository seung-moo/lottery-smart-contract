//artifacts.require build에 있는 json 파일 가져옴
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
