package templateTester;

import js.html.Event;
import js.html.TextAreaElement;
import miniftl.Ftl;

class Main {
	
	static var document:js.html.HTMLDocument = js.Browser.document;

	static function main() {
		final evaluateButton = document.getElementById( "evaluate" );
		evaluateButton.addEventListener( 'click', onEvaluateClick );
	}

	static function onEvaluateClick( e:Event ) {
		final templateInputElement = cast( document.getElementById( "template" ), TextAreaElement );
		final template = templateInputElement.value;
		
		final result = Ftl.process( template );
		result.handle( outcome -> {
			switch outcome {
				case Failure( failure ):document.getElementById( "result" ).innerHTML = failure;
				case Success( data ): document.getElementById( "result" ).innerHTML = data;
			}
		});
	}
}
