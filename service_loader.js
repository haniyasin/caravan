var path = require('path');

//uuid of all dsa instance equal to
var dsa_uuid = '000000000000002';

function context_constructor(service){
    var values = {
	
    }

    this.service = service;

    this.set = function(key, value){
	values[key] = value;
    }

    this.get = function(key){
	return values[key];
    }
}

function service_env(uuid, context, mq, env){
    var msg_handlers = {
	"set" : function(next, key, value){
//	    console.log(value);
	    context.set(key, value);
	},
	"get" : function(next, key){
	    next(context.get(key));
	}
    }

    function next(){
	
    }

    this.dispatch = function(msg){
	var name = msg.shift();
	msg.unshift(next);
	if(msg_handlers.hasOwnProperty(name))
	    msg_handlers[name].apply(null, msg);
    }

    this.react = function(msg_name, callback){
	msg_handlers[msg_name] = callback;
    }
    
    this.send = function(){
	var name = arguments[0];
	var _arguments = Array.prototype.slice.call(arguments);
	_arguments.splice(0, 1);
	mq.send(name, _arguments);
    }

    this.sequence = function(){
    }

}

exports.load = function(service, mq, env){
    var uuid = env.capsule.modules.uuid.generate_str();
    var context = new context_constructor(uuid);
    var senv = new service_env(uuid, context, mq, env); 
    require('./' + service + '.js')[path.basename(service)](context, senv.send, senv.react, senv.sequence);
    mq.on_msg(uuid, senv.dispatch);
    return uuid;
}