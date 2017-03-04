#!/usr/bin/env node
var irc = require('irc');
var dgram = require("dgram");
var sent_extra = false;

var relay1 = dgram.createSocket("udp4");
var relay2 = dgram.createSocket("udp4");
var relay3 = dgram.createSocket("udp4");
var config = require("./relay_irc.conf.js");

function in_array( array, obj ) {
	for( var i = 0; i < array.length; i++ ) {
		if( array[i] == obj ) {
			return true;
		}
	}
	return false;
}

var client = new irc.Client( config.server, config.nick, {
	userName: config.nick,
	realName: config.nick,
	debug: false,
	showErrors: true,
	autoRejoin: true,
	autoConnect: true,
	secure: false,
	channels: [
		'#cluebotng',
		'#cluebotng-spam'
	]
});

relay1.on('message', function(data, info) {
	if (!sent_extra) {
		for (var i = 0; i < config.extra.length; i++) {
			client.conn.write(config.extra[i] + "\r\n")
		}
		sent_extra = true;
	}

	data = data.toString().substring( 0, 450 );
	try {
		client.say( '#cluebotng', data );
	} catch ( e ){
		console.error( e )
	}
});

relay2.on('message', function(data, info) {
	if (!sent_extra) {
		for (var i = 0; i < config.extra.length; i++) {
			client.conn.write(config.extra[i] + "\r\n")
		}
		sent_extra = true;
	}

	data = data.toString().substring( 0, 450 );
	try {
		client.say( '#cluebotng-spam', data );
	} catch ( e ){
		console.error( e )
	}
});

relay3.on('message', function(data, info) {
	if (!sent_extra) {
		for (var i = 0; i < config.extra.length; i++) {
			client.conn.write(config.extra[i] + "\r\n")
		}
		sent_extra = true;
	}

	data = data.toString().split(' :', 2);
	try {
		chan = data[0].toString();
		msg = data[1].toString().substring( 0, 450 );

		if( !in_array( client.opt.channels, chan ) ) {
			try {
				client.join( chan );
			} catch( e ) { console.error( e ); }
		}

		client.say( chan, msg );
	} catch ( e ){
		console.error( e )
	}
});

client.addListener('error', function(message) {
	if (!sent_extra) {
		for (var i = 0; i < config.extra.length; i++) {
			client.conn.write(config.extra[i] + "\r\n")
		}
		sent_extra = true;
	}
	console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

client.addListener('motd', function(motd) {
	if (!sent_extra) {
		for (var i = 0; i < config.extra.length; i++) {
			client.conn.write(config.extra[i] + "\r\n")
		}
		sent_extra = true;
	}
});

relay1.bind( 3333 );
relay2.bind( 3334 );
relay3.bind( 1337 );
