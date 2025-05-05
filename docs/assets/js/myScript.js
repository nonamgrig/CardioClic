/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


function returnBorrowSuccess (theResult, buttonRef){
    if (buttonRef !== null){
        //get TD that owns the button
        var refTD = buttonRef.parentElement; 
        if (refTD !== null){
            //remove button
            refTD.removeChild(buttonRef); 
            //Set return date 
            var currentDate = new Date (((Date)(theResult.returnedValue))); 
            var currentDateStr = currentDate.toLocaleDateString(); 
            var text = document.createTextNode(currentDateStr); 
            refTD.appendChild(text); 
        }    
    }
}

function returnBorrow(buttonRef, borrowId){
    if (borrowId >0){
        // Collect data - empty
        
        // ajax call 
        $.ajax({
            url :"returnBorrow.do", 
            method : "Post", 
            data : {
                "id" : borrowId 
            }, 
            success : function(theResult){
                returnBorrowSuccess(theResult, buttonRef); 
            }, 
            error : function(theResult, theStatus, theError){
                console.log("Error :" + theStatus + " - " + theResult);
            }
        }); 
    }
}