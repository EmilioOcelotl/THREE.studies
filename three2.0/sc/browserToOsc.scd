m = NetAddr("localhost", 41234);// local machine

OSCdef(\test, {|msg, time, addr, recvPort| msg.postln}, '/aButton', n); // def style