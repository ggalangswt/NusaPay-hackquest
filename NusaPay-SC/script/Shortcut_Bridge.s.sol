// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Nusapay, IBasicTokenSender} from "../src/Nusapay.sol";
import {Client} from "lib/chainlink-ccip/chains/evm/contracts/libraries/Client.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract ShortcutBridgeScript is Script {
    address public usdc = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    uint64 public destinationArbChainId = 4949039107694359620;
    uint64 public destinationBaseChainId = 15971525489660198786;
    address public basicTokenSender = 0x0d837aD954F4f9F06E303A86150ad0F322Ec5EB1;
    address public linkToken = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    address public ccipRouter = 0x141fa059441E0ca23ce184B6A78bafD2A517DdE8;

    address public publicKey = 0xFA128bBD1846c19025c7428AEE403Fc06F0A9e38;

    function setUp() public {
        // vm.createSelectFork("https://arb1.arbitrum.io/rpc");
        vm.createSelectFork("https://virtual.arbitrum.rpc.tenderly.co/5e8e6306-694c-444f-a563-eece8ad210ef");
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        Nusapay nusapay = new Nusapay();

        //transfer 1 eth to basicTokenSender

        payable(basicTokenSender).transfer(1e18);

        // IERC20(linkToken).approve(address(nusapay), 1e18);
        // IERC20(linkToken).transfer(basicTokenSender, 1e18);

        IERC20(usdc).approve(address(nusapay), 100e6);
        
        nusapay.execBridge(
            publicKey,
            100e6,
            IBasicTokenSender.PayFeesIn.Native
        );
        vm.stopBroadcast();
    }
    // RUN
    // forge script script/Shortcut_Bridge.s.sol:ShortcutBridgeScript --rpc-url https://virtual.arbitrum.rpc.tenderly.co/5e8e6306-694c-444f-a563-eece8ad210ef --broadcast
}
