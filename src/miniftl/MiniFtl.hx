package miniftl;

import miniftl.Ftl;

@:expose("MiniFtl")
class MiniFtl {
	
	@:keep public static function process( template:String ) {
		return Ftl.process( template );
	}
}