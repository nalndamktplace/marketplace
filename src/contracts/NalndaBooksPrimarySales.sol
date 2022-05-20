// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NalndaBook.sol";

//primary sales /lazy minintg will only happen using NALNDA token.
contract NalndaBooksPrimarySales is Ownable {
    IERC20 public immutable NALNDA;
    uint256 public immutable commissionPercent; //primarySalesCommission percentage for primary sale/lazy minting
    address[] public bookAddresses;
    mapping(address => address[]) public authorToBooks;
    uint256 public totalBooksCreated;

    constructor(address _NALNDA) {
        require(
            _NALNDA != address(0),
            "NalndaPrimarySales: NALNDA token's address can't be null!"
        );
        NALNDA = IERC20(_NALNDA);
        //fixing commision percent to 5% for now
        commissionPercent = 5;
        totalBooksCreated = 0;
    }

    function createNewBook(
        address _author,
        string memory _coverURI,
        uint256 _initialPrice
    ) external {
        require(
            _author != address(0),
            "NalndaPrimarySales: Author's address can't be null!"
        );
        require(
            bytes(_coverURI).length > 0,
            "NalndaPrimarySales: Empty string passed as cover URI!"
        );
        address _addressOutput = address(
            new NalndaBook(_author, _coverURI, _initialPrice)
        );
        bookAddresses.push(_addressOutput);
        authorToBooks[_msgSender()].push(_addressOutput);
        totalBooksCreated++;
    }

    function bookToAuthor(address _book) public view returns (address author) {
        author = Ownable(_book).owner();
    }

    function withdrawCommissions() external onlyOwner {
        uint256 balance = NALNDA.balanceOf(address(this));
        require(balance != 0, "NalndaPrimarySales: Nothing to withdraw!");
        NALNDA.transfer(owner(), balance);
    }
}
