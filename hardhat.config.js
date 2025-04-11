require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18", // Mendukung block.prevrandao
      },
    ],
  },
  networks: {
    teaSepolia: {
      url: "https://tea-sepolia.g.alchemy.com/public", // Pastikan URL benar
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};