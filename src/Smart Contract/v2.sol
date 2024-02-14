// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFY{
    uint256 IPCounter;
    mapping(uint256 => IP)public IPDetails;
    mapping (uint256 => string) public URI;
    mapping(uint256=>string) public Name;
    mapping (address => uint256[]) public userOwnedIPs;
    mapping (address => Lend[]) public userLends;
    uint256[] buyingMarket;
    uint256[] lendingMarket;
    struct IP{
        address creator;
        address currenOwner;
        History[] owningHistory;
        History[] lendingHistory; 
        uint256 time;
        uint256 lendingPrice; //PerMonth
        uint256 buyingPrice;
        bool lendable;
        bool buyable;
    }
    struct History{
        uint256 start;
        uint256 end;
        uint256 amount;
        address wallet;
    }
    struct Lend{
        uint256 id;
        uint256 start;
        uint256 end;
        uint256 amount;
    }
    struct IPM{
        uint256 id;
        string name;
        address currenOwner;
        uint256 price;
        string uri;
        bool lendable;
        bool buyable;
        uint256 time;
    }
    function createIP(string memory _uri,string memory _name)public {
        IPCounter++;
        IPDetails[IPCounter].creator = msg.sender;
        IPDetails[IPCounter].currenOwner = msg.sender;
        IPDetails[IPCounter].time = block.timestamp;
        Name[IPCounter] = _name;
        URI[IPCounter] = _uri;
        userOwnedIPs[msg.sender].push(IPCounter);
    }

    function putforSell(uint256 _id,uint256 _price) public {
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        require(!IPDetails[_id].lendable, "Already in");
        IPDetails[_id].lendable = false;
        IPDetails[_id].buyable = true;
        removeFromLendingMarket(_id);
        IPDetails[_id].buyingPrice = _price;
        buyingMarket.push(_id);
    }
    function changeBuyingPrice(uint256 _id,uint256 _price) public{
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        IPDetails[_id].buyingPrice = _price;
    }
    function putforLend(uint256 _id,uint256 _price ) public {
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        require(!IPDetails[_id].lendable, "Already in");
        IPDetails[_id].lendable = true;
        IPDetails[_id].buyable = false;
        removeFromBuyingMarket(_id);
        IPDetails[_id].lendingPrice = _price;
        lendingMarket.push(_id);
    }
    function changeLendingPrice(uint256 _id,uint256 _price) public{
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        IPDetails[_id].lendingPrice = _price;
    }
    function buy(uint256 _id) public payable  {
        require(checkBuyablity(_id), "Not for sale");
        require(IPDetails[_id].buyingPrice<=msg.value,"please send the correct amount");
        removeFromBuyingMarket(_id);
        IPDetails[_id].buyable = false;
        uint256 time = IPDetails[_id].time;
        if(IPDetails[_id].owningHistory.length!=0){
            time = IPDetails[_id].owningHistory[IPDetails[_id].owningHistory.length-1].end;
        }
        IPDetails[_id].owningHistory.push(History(time, block.timestamp,IPDetails[_id].buyingPrice,IPDetails[_id].currenOwner));
        removeFromUserList(_id,IPDetails[_id].currenOwner);
        userOwnedIPs[msg.sender].push(_id);
        payable(IPDetails[_id].currenOwner).transfer(msg.value);
        IPDetails[_id].currenOwner = msg.sender;
        
    }

    
    function lend(uint256 _id, uint256 months) public payable {
        uint256 totalMoney = months*IPDetails[_id].lendingPrice;
        require(checkLendablity(_id), "Not for sale");
        require(totalMoney<=msg.value,"please send the correct amount");
        require(months<=24 && months>0,"max 24 months");
        removeFromLendingMarket(_id);
        IPDetails[_id].lendable = false;
        IPDetails[_id].lendingHistory.push(History(block.timestamp, block.timestamp+months*30 days*months,IPDetails[_id].lendingPrice,msg.sender));
        payable(IPDetails[_id].currenOwner).transfer(msg.value);
        userLends[msg.sender].push(Lend(_id,block.timestamp, block.timestamp+months*30 days*months,IPDetails[_id].lendingPrice));

    }

    function checkLendablity(uint256 _id)public view returns (bool){
        if(IPDetails[_id].lendingHistory.length>0){
            if(IPDetails[_id]
            .lendingHistory[IPDetails[_id].lendingHistory.length-1]
            .end > block.timestamp) return false;
        }
        return IPDetails[_id].lendable;
    }
    function checkBuyablity(uint256 _id) public view returns (bool){
        return IPDetails[_id].buyable;
    }
    function checkIPOwner(uint256 _id, address _wallet)public view returns (bool){
        return (_wallet==IPDetails[_id].currenOwner);
    }

    
    
    function transferOwnerShip(uint256 _id,address _newOwner)public {
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        uint256 time = IPDetails[_id].time;
        if(IPDetails[_id].owningHistory.length!=0){
            time = IPDetails[_id].owningHistory[IPDetails[_id].owningHistory.length-1].end;
        }
        IPDetails[_id].owningHistory.push(History(time, block.timestamp,0,IPDetails[_id].currenOwner));
        removeFromUserList(_id,msg.sender);
        userOwnedIPs[_newOwner].push(_id);
        IPDetails[_id].currenOwner = _newOwner;
    }
    function removeFromLendingMarket(uint256 _id) private {
        for(uint256 i=0;i<lendingMarket.length;i++){
            if(_id==lendingMarket[i]){
                lendingMarket[i] = lendingMarket[lendingMarket.length-1];
                lendingMarket.pop();
                break;
            }
        }
        
    }
    function removeFromBuyingMarket(uint256 _id) private {
        for(uint256 i=0;i<buyingMarket.length;i++){
            if(_id==buyingMarket[i]){
                buyingMarket[i] = buyingMarket[buyingMarket.length-1];
                buyingMarket.pop();
                break;
            }
        }
    }
    function removeFromUserList(uint256 _id, address _user) private {
        uint256[] memory list = userOwnedIPs[_user];
        for(uint256 i=0;i<list.length;i++){
            if(_id==list[i]){
                userOwnedIPs[_user][i] = list[list.length-1];
                userOwnedIPs[_user].pop();
                break;
            }
        }
    }
    function getBuyingMarket(uint256 start, uint256 end) public view returns(IPM[] memory){
        if(start>buyingMarket.length){
            start = 0;
            end = 0;
        }else if(end>buyingMarket.length){
            end = buyingMarket.length;
        }
        uint256 len = end-start;
        IPM[] memory result = new IPM[](len);
        for(uint256 i=start;i<end;i++){
            uint256 _id = buyingMarket[i];
            IP memory _ip = IPDetails[_id];
            result[i] = IPM(_id,Name[_id],_ip.currenOwner,_ip.buyingPrice,URI[_id],_ip.buyable,_ip.buyable,_ip.time);
        }
        return result;
    }
    function getLendingMarket(uint256 start, uint256 end) public view returns(IPM[] memory){
        if(start>lendingMarket.length){
            start = 0;
            end = 0;
        }else if(end>lendingMarket.length){
            end = lendingMarket.length;
        }
        uint256 len = end-start;
        IPM[] memory result = new IPM[](len);
        for(uint256 i=start;i<end;i++){
            uint256 _id = lendingMarket[i];
            IP memory _ip = IPDetails[_id];
            result[i] = IPM(_id,Name[_id],_ip.currenOwner,_ip.lendingPrice,URI[_id],_ip.lendable,_ip.lendable,_ip.time);
        }
        return result;
    }
    function getUserIPs(address _user)public view returns(IPM[] memory){
        uint256[] memory  userIps = userOwnedIPs[_user];
        uint256 len = userIps.length;
        IPM[] memory ips = new IPM[](userOwnedIPs[_user].length);
        for(uint256 i=0;i<len;i++){
            uint256 _id = userIps[i];
            IP memory _ip = IPDetails[_id];
            ips[i] = IPM(_id,Name[_id],_ip.currenOwner,_ip.buyingPrice,URI[_id],_ip.lendable,_ip.buyable,_ip.time);
        }
        return ips;
    }
    function withdrwLend(uint256 _id) public{
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        require(IPDetails[_id].lendable,"Not active");
        IPDetails[_id].lendable = false;
        removeFromLendingMarket(_id);
    }
    function withdrwBuy(uint256 _id) public{
        require(IPDetails[_id].currenOwner == msg.sender, "Only owner can modify");
        require(IPDetails[_id].buyable,"Not active");
        IPDetails[_id].buyable = false;
        removeFromBuyingMarket(_id);
    }
}