// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Client} from "lib/chainlink-ccip/chains/evm/contracts/libraries/Client.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

interface IBasicTokenSender {
    enum PayFeesIn {
        Native,
        LINK
    }

    function send(
        uint64 destinationChainSelector,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        PayFeesIn payFeesIn
    ) external;
}

interface IRouterClient {
    function getFee(uint64 _destinationChainId, Client.EVM2AnyMessage memory _message)
        external
        view
        returns (uint256);
}

contract Nusapay is ReentrancyGuard {
    using SafeERC20 for IERC20;

    event Bridge(address receiver, uint256 amount);

    address public usdc = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    uint64 public destinationArbChainId = 4949039107694359620;
    uint64 public destinationBaseChainId = 15971525489660198786;
    address public basicTokenSender = 0x0d837aD954F4f9F06E303A86150ad0F322Ec5EB1;
    address public linkToken = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    address public ccipRouter = 0x141fa059441E0ca23ce184B6A78bafD2A517DdE8;

    function execBridge(
        address _receiver,
        uint256 _amount,
        IBasicTokenSender.PayFeesIn _payFeesIn
    ) public nonReentrant {
        IERC20(usdc).safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(usdc).approve(basicTokenSender, _amount);

        Client.EVMTokenAmount[] memory _tokensToSendDetails = new Client.EVMTokenAmount[](1);
        _tokensToSendDetails[0] = Client.EVMTokenAmount({token: usdc, amount: _amount});

        IBasicTokenSender(basicTokenSender).send(
            destinationBaseChainId, _receiver, _tokensToSendDetails, _payFeesIn
        );
        emit Bridge(_receiver, _amount);
    }

    function getFee(
        address _receiver,
        Client.EVMTokenAmount[] memory _tokensToSendDetails,
        IBasicTokenSender.PayFeesIn _payFeesIn
    ) public view returns (uint256) {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: _tokensToSendDetails,
            extraArgs: "",
            feeToken: _payFeesIn == IBasicTokenSender.PayFeesIn.LINK ? linkToken : address(0)
        });
        uint256 fee = IRouterClient(ccipRouter).getFee(destinationBaseChainId, message);
        return fee;
    }
}
