const hre = require("hardhat");

async function main() {
  // Mendapatkan factory kontrak
  const Coinflip = await hre.ethers.getContractFactory("Coinflip");
  // Deploy kontrak
  const coinflip = await Coinflip.deploy();
  // Tunggu hingga deployment selesai
  await coinflip.waitForDeployment();
  // Dapatkan alamat kontrak
  const address = await coinflip.getAddress();
  console.log("Coinflip deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});