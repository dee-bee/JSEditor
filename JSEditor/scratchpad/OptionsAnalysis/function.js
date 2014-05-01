function generateOptionsTable(){
    var re = /(.*)\t(.*)\t(.*)\n/g
    var str = $("#rawText").text()
    //var matchd = []
    //matchd = re.exec(str)
    
    var output = ""
    
    output += '<tr><td>Year' + 
                '</td><td>Start Year Value' +
                '</td><td>End Year Value' +  
                '</td><td>Percent Gain' + 
                '</td><td>Option Premium' + 
                '</td><td >Profit</td></tr>'
    
    while(1){
        var matchd = []
        
        matchd = re.exec(str)
        
        if(matchd == null){
            break;
        }
        
        var year = parseInt(matchd[1])
        
        var indexToDollarsConversion = .1
        
        var numberOfShares = 100
        
        var averagePricePercentageOf1YearOption = .05
        
        var averageCommission = 20
        
        var startYearValue = parseInt(matchd[2])
        
        var optionPremium = startYearValue 
                                * indexToDollarsConversion 
                                * averagePricePercentageOf1YearOption 
                                * numberOfShares 
                                + averageCommission
        
        var endYearValue = parseInt(matchd[3])
        
        var yearOverYearChange = endYearValue - startYearValue
        
        var yearOverYearPercent = endYearValue/startYearValue - 1
        
        var profit = numberOfShares * endYearValue/startYearValue
        
        if(endYearValue < startYearValue){
            //You loose the premium
            profit = "-" + optionPremium
        }else{
            profit = numberOfShares
                        * yearOverYearChange 
                        * indexToDollarsConversion
                        - optionPremium
        }
        
        
        output += '<tr><td>' + year + 
                '</td><td>' + startYearValue +
                '</td><td>' + endYearValue +  
                '</td><td>' + yearOverYearPercent + 
                '</td><td class="premium">' + optionPremium + 
                '</td><td class="profit">' + profit + '</td></tr>'
        //break;
    }
    
    $("#theTable").html("<table>" + output + "</table>")
}

function totalProfits(){
    var totalGain = 0
    $("#theTable .profit").each(function(i,v){
        totalGain += parseFloat($(v).text())
    })
    
    alert(totalGain)    
}

function totalPremium(){
    var totalGain = 0
    $("#theTable .premium").each(function(i,v){
        totalGain += parseFloat($(v).text())
    })
    
    alert(totalGain) 
}
