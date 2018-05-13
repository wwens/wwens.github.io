'use strict';

var RedPacket = function(jsonStr) {
    if (jsonStr) {
	var obj = JSON.parse(jsonStr);
	this.sendAddress = obj.sendAddress;
	this.grabAddressList = obj.grabAddressList;	
	this.partNumber = obj.partNumber;
	this.randomParts = obj.randomParts;
	this.balance = obj.balance;
    } else {
	this.sendAddress = "";
	this.grabAddressList = [];
	this.partNumber = 0;
    }
};

RedPacket.prototype = {
    toString: function() {
	return JSON.stringify(this);
    }
};

var RedPacketContract = function() {
    LocalContractStorage.defineMapProperty(this, "packetPool", {
	parse: function(jsonText) {
	    return new RedPacket(jsonText);
	},
	stringify: function(obj) {
	    return obj.toString();
	}
    });
};

RedPacketContract.prototype = {
    init: function() {
    },

    send: function(partNumber) {
	var sendAddress = Blockchain.transaction.from;
	var balance = Blockchain.transaction.value;

	if (partNumber > 1000) {
	    throw new Error("max partNumber limit 1000");
	}

	var from = Blockchain.transaction.from;
	var hash = Blockchain.transaction.hash;
	
	var redPacket = new RedPacket();
	redPacket.sendAddress = from;
	redPacket.grabAddressList = [];
	redPacket.partNumber = partNumber;
	redPacket.randomParts = this.random(partNumber);
	redPacket.balance = Blockchain.transaction.value;

	this.packetPool.set(hash, redPacket);
    },

    grab: function(hash) {
	var redPacket = this.packetPool.get(hash);
	if (! redPacket) {
	    throw new Error("Sorry, this red packet doesnt't exists");
	} else if (len(redPacket.grabAddressList) == redPacket.partNumber) {
	    throw new Error("Sorry, your hand speed is slow");
	} else {
	    var grabAddress = Blockchain.transaction.from;

	    // grab the red packet
	    var result = Blockchain.transfer(grabAddress, this.randomParts[len(redPacket.grabAddressList]);
	    if (! result) {
		throw new Error("transfer failed.");
	    }
	    
	    this.packetPool.get(i).grabAddressList.push(grabAddress);
	}
    },

    random: function(hash, balance, randomParts) {
	var randomParts = [];
	var hashLen = len(hash);
	var sum = 0;
	
	for (var i = 0; i < randomParts; i++) {
	    var rand = parseInt(hash.charCodeAt(i % hashLen).toString().slice(-2))
	    sum += rand;
	    randomParts.push(rand);
	}

	for (var i = 0; i < randParts; i++) {
	    randomParts[i] = randomParts[i] * balance % num;
	}
    }
}
