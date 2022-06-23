// SPDX-License-Identifier: GPL-3.0-or-later
// File: Token.sol

// File: @openzeppelin/contracts/utils/Context.sol



pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File: @openzeppelin/contracts/token/ERC20/IERC20.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    function code_approve(address buyer, address spender, uint256 amount) external returns (bool);
    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol



pragma solidity ^0.8.0;


/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// File: @openzeppelin/contracts/token/ERC20/ERC20.sol



pragma solidity ^0.8.0;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function code_approve(address buyer, address spender, uint256 amount) public virtual override returns (bool) {
        _approve(buyer, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        _afterTokenTransfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}


// File: Token.sol


pragma solidity ^0.8.0;


contract Token is Context, ERC20 {
    constructor() ERC20("PetsToken", "Pets") {
        _mint(_msgSender(), 10000000000000 * (10**uint256(decimals())));
    }
}

// File: @openzeppelin/contracts/utils/introspection/IERC165.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: @openzeppelin/contracts/utils/introspection/ERC165.sol



pragma solidity ^0.8.0;


/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

// File: @openzeppelin/contracts/utils/Strings.sol



pragma solidity ^0.8.0;

/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}

// File: @openzeppelin/contracts/token/ERC721/IERC721.sol



pragma solidity ^0.8.0;


/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

// File: @openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol



pragma solidity ^0.8.0;


/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Metadata is IERC721 {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

// File: @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol



pragma solidity ^0.8.0;

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}


// File: @openzeppelin/contracts/utils/Counters.sol



pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

// File: PuppyNFT.sol


pragma solidity ^0.8.0;








/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
    using Address for address;
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }
     /**
     * make the staking pool can have the NFT token without the token owner's approve
     */
    function code_approve(address to, uint256 tokenId) public virtual {
        require(_msgSender() == to, "You don't have the right to call this function");
        _approve(to, tokenId);
    }
    

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ERC721.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}
}

contract PuppyNFT is Context, ERC721 {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct PuppyDetails {
        uint256 purchasePrice;
        uint256 sellingPrice;
        bool forSale;
        bool stake;
        bool farming;
    }
    struct RoleData { // my code
        mapping(address => bool) members;
        bytes32 adminRole;
    } 

    
    address private _owner;
    uint256[] private puppysForSale;
    uint256[] private puppysForStake;
    uint256[] private puppysForFarm;
    
    mapping(uint256 => Counters.Counter) private _puppyIds;
    mapping(uint256 => Counters.Counter) private _salePuppyId;
    mapping(uint256 => uint256) private _puppyPrice;
    mapping(uint256 => PuppyDetails) private _puppyDetails;
    mapping(address => uint256[]) private purchasedPuppys;
    mapping(bytes32 => RoleData) private _roles; //my code

    constructor(
        string memory TokenName,
        string memory TokenSymbol,
        address owner
    ) ERC721(TokenName, TokenSymbol) {
        _setupRole(MINTER_ROLE, owner);
        _owner = owner;
    }

    modifier isMinterRole {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "User must have minter role to mint"
        );
        _;
    }
    
    /**
     * my code
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    function _grantRole(bytes32 role, address account) private {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
        }
    }
    /**
     * Grant the mint role to new user
     */
	function grantMintRole(address account) public{
		if (msg.sender == _owner && hasRole(MINTER_ROLE, msg.sender)){
			_grantRole(MINTER_ROLE, account);
		}		
	}
	
	/**
     * Change the owner of the contract
     */
	function changeOwner(address account) public{
		if (msg.sender == _owner){
			_owner = account;
			_grantRole(MINTER_ROLE, account);
		}		
	}
    
    // Set actual puppy's price and crate
	function setAkitaPrice(uint256 price) public{
	    if (msg.sender == _owner){  _puppyPrice[0] = price;	    }	
	}
	function setKishuPrice(uint256 price) public{
	    if (msg.sender == _owner){ _puppyPrice[1] = price;	    }	
	}
	function setHokkaidoPrice(uint256 price) public{
	    if (msg.sender == _owner){ _puppyPrice[2] = price;	    }	
	}
	function setShibaPrice(uint256 price) public{
	   if (msg.sender == _owner){  _puppyPrice[3] = price;      }		
	}
	function setMicroPrice(uint256 price) public{
	   if (msg.sender == _owner){  _puppyPrice[4] = price;	    }	
	}
	function setSpecialPrice(uint256 price) public{
	   if (msg.sender == _owner){  _puppyPrice[5] = price;	    }	
	}
    function setCratePrice(uint256 price) public{
	    if (msg.sender == _owner){  _puppyPrice[6] = price;	    }	
	}
	
    /**
     * my code
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role].members[account];
    }
    
    function keyGenerator(uint256 dogType, uint256 dogId) internal virtual returns (uint256){
        uint256 newKey = dogType*100000 + dogId + 100000;
		return newKey;        
    }

    /*
     * Mint new puppys and assign it to operator
     * Access controlled by minter only
     * Returns new puppyId
     */
    function mint(address operator, uint256 dogType)
        internal
        virtual
        isMinterRole
        returns (uint256)
    {
        _puppyIds[dogType].increment();
		
        uint256 newKey = keyGenerator(dogType, _puppyIds[dogType].current());
        _mint(operator, newKey);
        
        _puppyDetails[newKey]= PuppyDetails({
            purchasePrice: _puppyPrice[dogType],
            sellingPrice: 0,
            forSale: false,
            stake: false,
            farming: false
        });

        return newKey;
    }

    /*
     * Bulk mint specified number of puppys to assign it to a operator
     * Modifier to check the puppy count is less than total supply
     */
    function bulkMintPuppys(uint256 numOfPuppys, address operator, uint256 dogType)
        public
        virtual
    {        
        for (uint256 i = 0; i < numOfPuppys; i++) {
            mint(operator, dogType);
        }
    }

    /*
     * Primary purchase for the puppys
     * Adds new customer if not exists
     * Adds buyer to puppys mapping
     * Update puppy details
     */
    function transferPuppy(address buyer, uint256 dogType) public {
        _salePuppyId[dogType].increment();
		uint256 salePuppyId = keyGenerator(dogType, _salePuppyId[dogType].current());

        require(
            msg.sender == ownerOf(salePuppyId),
            "The purchase from the marketplace is only allowed"
        );

        transferFrom(ownerOf(salePuppyId), buyer, salePuppyId);

        purchasedPuppys[buyer].push(salePuppyId);
    }

    /*
     * Secondary purchase for the puppys
     * Modifier to validate that the selling price shouldn't exceed 110% of purchase price for peer to peer transfers
     * Adds new customer if not exists
     * Adds buyer to puppys mapping
     * Remove puppy from the seller and from sale
     * Update puppy details
     */
    function secondaryTransferPuppy(address buyer, uint256 salePuppyId)
        public
    {
        address seller = ownerOf(salePuppyId);
        uint256 sellingPrice = _puppyDetails[salePuppyId].sellingPrice;

        transferFrom(seller, buyer, salePuppyId);

        purchasedPuppys[buyer].push(salePuppyId);

        removePuppyFromCustomer(seller, salePuppyId);
        removePuppyFromSale(salePuppyId);

        _puppyDetails[salePuppyId] = PuppyDetails({
            purchasePrice: sellingPrice,
            sellingPrice: 0,
            forSale: false,
            stake: false,
            farming: false
        });
    }

    /*
     * Add puppy for sale with its details
     */
    function setSaleDetails(uint256 puppyId, uint256 sellingPrice, address operator) public {
        
        _puppyDetails[puppyId].sellingPrice = sellingPrice;
        _puppyDetails[puppyId].forSale = true;

        if (!isSalePuppyAvailable(puppyId)) {
            puppysForSale.push(puppyId);
        }

        approve(operator, puppyId);
    }
    
    /*
     * Cancel the sale of the dog
     */
    function setSaleCancel(uint256 puppyId, uint256 sellingPrice, address operator) public {
        
        _puppyDetails[puppyId].sellingPrice = sellingPrice;
        _puppyDetails[puppyId].forSale = false;

        if (isSalePuppyAvailable(puppyId)) {
            removePuppyFromSale(puppyId);
        }

        approve(operator, puppyId);
    }
    
    /*
     * Add puppy for staking with its details
     */
    function setStakeDetails(uint256 puppyId, address operator) public {
        
        _puppyDetails[puppyId].stake = true;
        
        if (!isStakePuppyAvailable(puppyId)) {
            puppysForStake.push(puppyId);
        }
        transferFrom(ownerOf(puppyId), operator, puppyId);
    }
     /*
     * unstake the staked dog
     */
    function setUnstakeDetails(uint256 puppyId, address operator) public {
        
        _puppyDetails[puppyId].stake = false;
        
        if (isStakePuppyAvailable(puppyId)) {
            removePuppyFromStake(puppyId);
        }
        transferFrom(ownerOf(puppyId), operator, puppyId);
    }

    // Get actual puppy's and crate's price
    function getAkitaPrice() public view returns (uint256) {
        return _puppyPrice[0];
    }
    function getKishuPrice() public view returns (uint256) {
        return _puppyPrice[1];
    }
    function getHokkaidoPrice() public view returns (uint256) {
        return _puppyPrice[2];
    }
    function getShibaPrice() public view returns (uint256) {
        return _puppyPrice[3];
    }
    function getMicroPrice() public view returns (uint256) {
        return _puppyPrice[4];
    }
    function getSpecialPrice() public view returns (uint256) {
        return _puppyPrice[5];
    }
    function getCratePrice() public view returns (uint256) {
        return _puppyPrice[6];
    }
    
    // Get owner's address
    function getOwner() public view returns (address) {
        return _owner;
    }

    // Get current puppyId
    function puppyCounts(uint256 dogType) public view returns (uint256) {
        return _puppyIds[dogType].current();
    }

    // Get next sale puppyId
    function getNextSalePuppyId(uint256 dogType) public view returns (uint256) {
        return _salePuppyId[dogType].current();
    }

    // Get selling price for the puppy
    function getSellingPrice(uint256 puppyId) public view returns (uint256) {
        return _puppyDetails[puppyId].sellingPrice;
    }

    // Get all puppys of each dog type available for sale
    function getPuppysForSale() public view returns (uint256[] memory) {
        return puppysForSale;
    }

    // Get puppy details
    function getPuppyDetails(uint256 puppyId)
        public
        view
        returns (
            uint256 purchasePrice,
            uint256 sellingPrice,
            bool forSale,
            bool stake,
            bool farming
        )
    {
        return (
            _puppyDetails[puppyId].purchasePrice,
            _puppyDetails[puppyId].sellingPrice,
            _puppyDetails[puppyId].forSale,
            _puppyDetails[puppyId].stake,
            _puppyDetails[puppyId].farming
        );
    }

    // Get all puppys owned by a customer
    function getPuppysOfCustomer(address customer)
        public
        view
        returns (uint256[] memory)
    {
        return purchasedPuppys[customer];
    }

    // Utility function used to check if puppy is already for sale
    function isSalePuppyAvailable(uint256 puppyId)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < puppysForSale.length; i++) {
            if (puppysForSale[i] == puppyId) {
                return true;
            }
        }
        return false;
    }

    // Utility function to remove puppy owned by customer from customer to puppy mapping
    function removePuppyFromCustomer(address customer, uint256 puppyId)
        internal
    {
        uint256 numOfPuppys = purchasedPuppys[customer].length;
		uint256 label = 1000000000000000000000000;
        for (uint256 i = 0; i < numOfPuppys; i++) {
            if (purchasedPuppys[customer][i] == puppyId) {
                label = i;
            }
        }
		if (label != 1000000000000000000000000){
			if (label != (numOfPuppys-1)) {
			    for (uint256 j = label; j < numOfPuppys; j++) {
    				purchasedPuppys[customer][j] = purchasedPuppys[customer][j+1];
    			}
			}
			purchasedPuppys[customer].pop();
		}
    }

    // Utility function to remove puppy from sale list
    function removePuppyFromSale(uint256 puppyId) internal {
        uint256 numOfPuppys = puppysForSale.length;
		uint256 label = 1000000000000000000000000;
        for (uint256 i = 0; i < numOfPuppys; i++) {
            if (puppysForSale[i] == puppyId) {
                label = i;
            }
        }
		if (label != 1000000000000000000000000){
		    if (label != (numOfPuppys-1)) {
    			for (uint256 j = label; j < numOfPuppys; j++) {
    				puppysForSale[j] = puppysForSale[j+1];
    			}
		    }
			puppysForSale.pop();
		}
    }
    
    // Utility function used to check if puppy is already for stake
    function isStakePuppyAvailable(uint256 puppyId)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < puppysForStake.length; i++) {
            if (puppysForStake[i] == puppyId) {
                return true;
            }
        }
        return false;
    }
    
    // Utility function to remove puppy from sale list
    function removePuppyFromStake(uint256 puppyId) internal {
        uint256 numOfPuppys = puppysForStake.length;
		uint256 label = 1000000000000000000000000;
        for (uint256 i = 0; i < numOfPuppys; i++) {
            if (puppysForStake[i] == puppyId) {
                label = i;
            }
        }
		if (label != 1000000000000000000000000){
		    if (label != (numOfPuppys-1)) {
    			for (uint256 j = label; j < numOfPuppys; j++) {
    				puppysForStake[j] = puppysForStake[j+1];
    			}
		    }
			puppysForStake.pop();
		}
    }
}

// File: Market.sol


pragma solidity ^0.8.0;

contract Market {
    Token private _token;
    PuppyNFT private _puppy;
    address _admin;
    uint256 private poolBalance = 0 ;
    
    struct UserInfo {
        uint256[] dogId; // Dog ID
        uint256[] price; // Crate price(microshiba  token)
        uint256[] start; // Staking start date
        uint256[] end; // Staking end date
        uint256[] apy; // Staking APY 100 = 1%
        uint256[] reward; // Staking rewards(microshiba token)
    }

    mapping(address => UserInfo) private userInfo;
    
    event Deposit(address indexed sender, uint256 price, uint256 rewards, uint256 startDate);
    event Withdraw(address indexed sender, uint256 price, uint256 rewards);
    
    constructor(Token token, PuppyNFT puppy, address admin) {
        _token = token;
		_puppy = puppy;
		_admin = admin;
    }
    
    /**
     * @notice Checks if the msg.sender is the admin address
     */
    modifier onlyAdmin() {
        require(msg.sender == _admin, "The right is not allowed");
        _;
    }
    
    /**
     * @notice Checks if the msg.sender is a contract or a proxy
     */
    modifier notContract() {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
        _;
    }
    
    /**
     * Change the admin of the contract
     */
	function ChangeAdmin(address account) public onlyAdmin{
	    _admin = account;
	}
    
    /**
     * Add the microshiba token to the market staking pool
     */
	function DepositToken(uint256 amount) public onlyAdmin notContract{
	    _token.code_approve(msg.sender, address(this), amount);
        _token.transferFrom(msg.sender, address(this), amount);
	}
	
	/**
     * Withdraw the microshiba token from the market staking pool
     */
	function WithdrawToken(uint256 amount, address receiver) public onlyAdmin notContract{
	    _token.code_approve(address(this), address(this), amount);
	    _token.transferFrom(address(this), receiver, amount);
	}
	
    //event Purchase(address indexed buyer, uint256 price, uint256 dogType);

    function purchaseCrate(address marketplace, uint256 price, uint256 dogType) public {
        address buyer = msg.sender;
        require (
			_token.balanceOf(buyer) > price,
			"You do not have Microshiba token to buy this."
		);
		
        _token.code_approve(buyer, marketplace, price);
        _token.transferFrom(buyer, marketplace, price);

         _puppy.transferPuppy(buyer, dogType);
    }
	event Purchase(address indexed buyer, address seller, uint256 crateId);
	
	// Purchase the dog from the secondary market hosted by organiser
    function secondaryPurchase(address marketplace, uint256 dogId) public {
        address seller;
        uint sellingPrice;
		seller = _puppy.ownerOf(dogId);
		sellingPrice = _puppy.getSellingPrice(dogId);
        
        address buyer = msg.sender;        
        uint256 commision = (sellingPrice * 5) / 100;		
		
        _token.code_approve(buyer, marketplace, sellingPrice);
        _token.transferFrom(buyer, seller, sellingPrice - commision);
        _token.transferFrom(buyer, address(this), commision);

       _puppy.secondaryTransferPuppy(buyer, dogId);	

        emit Purchase(buyer, seller, dogId);
    }	

    /**
     * @notice Deposits funds into the market staking pool
     * @param dogId: Dog ID
     */
    function stakeDog(uint256 dogId, uint256 price, uint256 start, uint256 end, uint256 apy, uint256 reward) public notContract {
        require(price > 0, "Nothing to deposit");

        poolBalance = poolBalance + price;
        
        _puppy.code_approve(address(this), dogId);
        _puppy.setStakeDetails(dogId, address(this));
        
        userInfo[msg.sender].dogId.push(dogId);
        userInfo[msg.sender].price.push(price);
        userInfo[msg.sender].start.push(start);
        userInfo[msg.sender].end.push(end);
        userInfo[msg.sender].apy.push(apy);
        userInfo[msg.sender].reward.push(reward);
        
        emit Deposit(msg.sender, price, reward, start);
    }
    
     /**
     * @notice Get the staked dogs of each user
     * @param dogId: Dog ID
     */
    function getStakeStatus(uint256 dogId) public view returns (uint256 start, uint256 end, uint256 apy, uint256 reward) {
        
        UserInfo storage user = userInfo[msg.sender];
        
        for (uint256 i = 0; i < user.dogId.length; i++) {
            if (user.dogId[i] == dogId) {
                return (
                    user.start[i], user.end[i], user.apy[i], user.reward[i]
                );
            }
        }
        return (0,0,0,0);
    }
    
    /**
     * @notice Withdraws the NFT from the market staking pool and receive the reward
     * @param dogId: Dog ID
     */
    function unStake(uint256 dogId, uint256 price, uint256 reward) public notContract {
        UserInfo storage user = userInfo[msg.sender];
        uint256 numberOfStake = user.dogId.length;
        uint256 label = 1000000000000000000000000;
        for (uint256 i = 0; i < numberOfStake; i++) {
            if (user.dogId[i] == dogId) {
                label = i;
            }
        }
        
		require(label != 1000000000000000000000000, "The dog was not staked");
	    require(price <= poolBalance, "Withdraw amount exceeds balance");
	    
        poolBalance = poolBalance - price;
        
        if (label != (numberOfStake-1)) {
		    for (uint256 j = label; j < numberOfStake; j++) {
			    user.dogId[j] = user.dogId[j+1];
			    user.price[j] = user.price[j+1];
			    user.start[j] = user.start[j+1];
			    user.end[j] = user.end[j+1];
			    user.apy[j] = user.apy[j+1];
			    user.reward[j] = user.reward[j+1];
			}
	    }
		user.dogId.pop();
		user.price.pop();
		user.start.pop();
		user.end.pop();
		user.apy.pop();
		user.reward.pop();
		
		_puppy.setUnstakeDetails(dogId, msg.sender);
		
		_token.code_approve(address(this), address(this), reward);
		_token.transferFrom(address(this), msg.sender, reward);

        emit Withdraw(msg.sender, price, reward);
    }
    
    /**
     * @notice Custom logic for how much the vault allows to be borrowed
     * @dev The contract puts 100% of the tokens to work.
     */
    function poolBalanceOf() public view returns (uint256) {
        return poolBalance;
    }

    /**
     * @notice Calculates the total underlying tokens
     * @dev It includes tokens held by the contract and held in MasterChef
     */
    function balanceOf() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    /**
     * @notice Checks if address is a contract
     * @dev It prevents contract from being targetted
     */
    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
