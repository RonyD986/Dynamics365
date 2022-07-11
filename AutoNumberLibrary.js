// This function is used to fetch all records from a specific entity
// We will use this function to get the exact number of records of an entity and create the autonumber based on this value

// DO NOT CHANGE ANYTHING INSIDE THIS FUNCTION

function getAllRecords(sEntityName, sColumns, sFilter, sOrderBy) {
 
	var serverUrl = Xrm.Page.context.getClientUrl();
 
	var ODATA_ENDPOINT = "/api/data/v9.0";
 
	var odataUri = serverUrl + ODATA_ENDPOINT + "/" + sEntityName + "?";
 
	if (sColumns) {
		odataUri += "$select=" + sColumns;
	}
	 
	if (sFilter) {
		odataUri += "&$filter=" + sFilter;
	}
	 
	if (sOrderBy){
		odataUri += "&$orderby=" + sOrderBy;
	}
	
	var data;
	
	try
	{ 
		
		var req = new XMLHttpRequest();
		
		//alert(odataUri);
		
		req.open("GET", encodeURI(odataUri), false);
		
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");		
		req.send(null);
		
		data = JSON.parse(req.responseText);
		
		return data;
	}
	catch (ex){
		alert("Error: getAllRecords - Data Set =" + odataSetName + "; filter = " + sFilter + "; select = " + sSelect + "; Error = " + ex.message);
	}
}

// Use this function to create and set a number for a record when it is created
// Change the values of "sEntityName, sColumns, sFilter, sOrderBy" according to your needs
// sEntity is the name of the entity you are working with
// sColumns is any column present inside the entity defined previously
// sFilter is used to filter retrieved data (Not necessary in this case)
// sOrderBy is used to sort the retrieved data (Not necessary in this case)
function setAutoNumber(){
	var AutoNumber = 0;
    //Set the entity name to retrieve records number from
    // Use the plural name
    var sEntityName = "new_testentities";

    //Set the columns to retrieve from the entity
    //The field that will hold the number, in our case it is called new_number
    var sColumns = "new_number";

    //Prepare filter
	var sFilter = "";

    //Order By Nothing
    var sOrderBy = "";

    //Query the data	
	var requestResults  = getAllRecords(sEntityName, sColumns, sFilter, sOrderBy);

    //Loop through the results
    if (requestResults != null) {
			
		if (requestResults.value != null && requestResults.value.length > 0) {
				
			for (var i = 0; i < requestResults.value.length; i++) {
				 
                var oProduct = requestResults.value[i];

				var firstint = parseInt(oProduct.new_number);
				
				if(firstint > AutoNumber){
					
					AutoNumber = firstint;

				}

            }
            AutoNumber++;

			if(AutoNumber >=0 && AutoNumber < 10){
				Xrm.Page.getAttribute("new_number").setValue("0000"+AutoNumber);
			}

			if(AutoNumber >=10 && AutoNumber < 100){
				Xrm.Page.getAttribute("new_number").setValue("000"+AutoNumber);
			}

			if(AutoNumber >=100 && AutoNumber < 1000){
				Xrm.Page.getAttribute("new_number").setValue("00"+AutoNumber);
			}

			if(AutoNumber >=1000 && AutoNumber < 10000){
				Xrm.Page.getAttribute("new_number").setValue("0"+AutoNumber);
			}

			if(AutoNumber >=10000 && AutoNumber < 100000){
				Xrm.Page.getAttribute("new_number").setValue(+AutoNumber);
			}

           
        }
          else{
		  AutoNumber = 1;
                  Xrm.Page.getAttribute("new_number").setValue("0000"+ AutoNumber);    
    }
    
}
}

// This function is used to get the form context and call the previous function

// DO NOT CHANGE ANYTHING INSIDE THIS FUNCTION

function setNumber(executionContext){
    var formcontext = executionContext.getFormContext();
	if(formcontext.ui.getFormType()==1){
		setAutoNumber();
	}

}