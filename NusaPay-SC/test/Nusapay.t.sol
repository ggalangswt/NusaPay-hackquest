// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Nusapay} from "../src/Nusapay.sol";
import {Client} from "lib/chainlink-ccip/chains/evm/contracts/libraries/Client.sol";
import {IBasicTokenSender} from "../src/Nusapay.sol";

contract NusapayTest is Test {
    Nusapay public nusapay;
    address public usdc = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address public basicTokenSender = 0x0d837aD954F4f9F06E303A86150ad0F322Ec5EB1;
    address public linkToken = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    address public ccipRouter = 0x141fa059441E0ca23ce184B6A78bafD2A517DdE8;

    address public alice = makeAddr("alice");

    function setUp() public {
        vm.createSelectFork("https://arb1.arbitrum.io/rpc");
        vm.deal(usdc, 1000000000000000000);
        vm.deal(linkToken, 1000000000000000000);
        nusapay = new Nusapay();
    }

    function test_getFee() public {
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
        tokensToSendDetails[0] = Client.EVMTokenAmount({token: usdc, amount: 1000000000000000000});
        uint256 fee = nusapay.getFee(alice, tokensToSendDetails, IBasicTokenSender.PayFeesIn.Native);
        console.log("fee", fee);

        // 0.016942148024545480 LINK
        // 0.000103504760321952 ETH
    }
}