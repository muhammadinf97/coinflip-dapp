// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18; // Ubah ke ^0.8.18 atau lebih tinggi

contract Coinflip {
    address public owner;
    uint256 public minBet = 0.01 ether;
    uint256 public maxBet = 1 ether;

    event Flip(address indexed player, uint256 amount, bool result, uint256 payout);

    constructor() {
        owner = msg.sender;
    }

    // Fungsi untuk menghasilkan angka acak sederhana
    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 2;
    }

    // Fungsi untuk melakukan coinflip
    function flip() public payable {
        require(msg.value >= minBet && msg.value <= maxBet, "Bet amount out of range");
        uint256 result = random(); // 0 = Heads, 1 = Tails
        bool won = result == 0; // Heads menang

        if (won) {
            uint256 payout = msg.value * 2;
            require(address(this).balance >= payout, "Contract out of funds");
            (bool sent, ) = msg.sender.call{value: payout}("");
            require(sent, "Failed to send Ether");
            emit Flip(msg.sender, msg.value, true, payout);
        } else {
            emit Flip(msg.sender, msg.value, false, 0);
        }
    }

    // Fungsi untuk menambah dana ke kontrak
    function fundContract() public payable {
        require(msg.sender == owner, "Only owner can fund");
    }

    // Fungsi untuk menarik dana
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to withdraw");
    }

    // Fungsi untuk cek saldo kontrak
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}