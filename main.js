const fs = require('fs');
const fileName = "/home/sam/Proj/nodejs/xmlparse/files/2021-10-04.030.2.xml"

let totalCount = 0;

class TransData {
    constructor(trDate, trNO, trAmount, trCustomer)
    {
        this.trDate = trDate;
        this.trNO = trNO;
        this.trAmount = trAmount;
        this.trCustomer = trCustomer;
    }

};


function parseNodetrLines(xmlNode)
{
    /**
     *   {
      ATTR: [Object],
      trlTaxes: [Array],
      trlFlags: [Array],
      trlDept: [Array],
      trlNetwCode: [Array],
      trlQty: [Array],
      trlSign: [Array],
      trlSellUnit: [Array],
      trlUnitPrice: [Array],
      trlLineTot: [Array],
      trlDesc: [Array],
      trlUPC: [Array],
      trlModifier: [Array],
      trlUPCEntry: [Array]
    }
     */
    console.log("Start lines");
    var trPaylines = xmlNode['trLines'];
    for(i=0; i< trPaylines.length;i++)
    {
        console.log(trPaylines[i]);
    } 
    console.log("End lines");
}

function parseNodetrPaylines(xmlNode)
{
    /**
     * {
      ATTR: [Object],
      trpPaycode: [Array],
      trpAmt: [Array],
      trpHouseAcct: [Array]
    }
     */
    var trPaylines = xmlNode['trPaylines'];
    let cusName = "";
    if(trPaylines != undefined)
    {
        var tttr = trPaylines[0].trPayline;
        for(i=0; i< tttr.length;i++)
        {
            if(tttr[i].trpHouseAcct != undefined)
            {
                for(j=0; j<tttr[i].trpHouseAcct.length; j++)
                    if(tttr[i].trpHouseAcct[j]['ATTR']!= undefined){
                        cusName = tttr[i].trpHouseAcct[j]['ATTR'].name;
                        //console.log(totalCount++, i, j, cusName);//['ATTR'])
                    }
            }
        }
    }
    else{
        cusName = "";
    } 
    return cusName;
}


function parseNode(xmlNode)
{
    custName = parseNodetrPaylines(xmlNode); 
    if(custName.length==0)
        return 0;

    var data1 = new TransData(
        //date
        xmlNode['trHeader'][0].date[0], 
        //no
        xmlNode['trHeader'][0].termMsgSN[0]['_'],
        // Amount  
        xmlNode['trValue'][0].trTotWTax[0],
        // customer
        custName
    );


    //console.log("Start");
     //parseNodetrPaylines(xmlNode);

    //not needed
    //    console.log(xmlNode)/;
    //parseNodetrLines(xmlNode);
    //console.log("End");
    return data1;
}


const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

const xmlFile = fs.readFileSync(fileName, 'utf8');

parser.parseString(xmlFile, 
    function(error, result) {
    if(error === null) {
        AllTransData = [];
        let j=0;
        arrayObj = result['transSet']['trans']; 
        for (let i = 0; i < arrayObj.length; i++) {
            if(arrayObj[i].ATTR.type == 'sale')
            {
                var yyyy = parseNode(arrayObj[i]);
                if(yyyy != 0)
                {
                    AllTransData[j++] = yyyy;
                    console.log("yy: ", yyyy);
                }
            }
        }

        // console.log("j= ", j);
        // console.log("array = ", AllTransData.length);
        xyz = 0;
        AllTransData.forEach(element => {
            console.log(xyz++, element);
        });

    }
    else {
        console.log(error);
    }
});
