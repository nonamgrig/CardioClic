/** ------------------------------------------
 main.js
 
 javascript functions for practical work
 
 JY Martin
 Ecole Centrale Nantes
 ------------------------------------------ */

// -----------------------------------------------------------------------------
/**
 * Launch ajax call to delete a book
 * @param {type} bookID
 * @param {type} buttonRef
 * @returns {undefined}
 */
function deleteBook(bookID, buttonRef) { 
	if (buttonRef !== null) {
		// Collect data
		// Ajax call
		$.ajax({
			url :"prwebStep2.php", method :"POST",
			data :{
				"bookID" : bookID, 
			},
			success : function (theResult) {
				if (theResult.ok === 1) {
					// get current TR
					var ref = buttonRef ;
					while ((ref !== null) && (ref.tagName !== "TR")) {
						ref = ref.parentElement ; 
					}
					if (ref !== null) { 
						ref.parentElement.removeChild(ref) ;
					}
				}
			},
			error : function(theResult, theStatus, theError) {
				console.log("Error : "+theStatus+" - "+theResult) ;
			} 
		});
	}
}