export const getCdrColumnName = (data) => {
    switch(data){
        case 'id': return 'Record Id';
        case 'yyyymm': return 'Date';
        case 'timestampdate': return 'Timestamp (Date)';
        case 'timestamptime': return 'Timestamp (Time)';
        case 'answerdate' : return 'Answer (Date)';
        case 'answertime' : return 'Answer (Time)';
        case 'callduration' : return 'Call Duration';
        case 'calledimei' : return 'Called IMSI';
        case 'calledimsi' : return 'Called IMSI';
        case 'callednumber' : return 'Called MSISDN';
        case 'callingnumber' : return 'Calling MSISDN';
        case 'servedimei' : return 'Served IMEI';
        case 'servedimsi' : return 'Served IMSI';
        case 'servedmsisdn' : return 'Served MSISDN';
        case 'locationestimate' : return 'Location Estimate';
        case 'locationlat' : return 'Cell Lat';
        case 'locationlon' : return 'Cell Lon';
        case 'callredirectionflag' : return 'Call Direction';
        case 'cgi': return 'CGI';
        case 'city' : return 'City';
        case 'connectednumber': return 'Connected Number';
        case 'eventtype' : return 'Event Type';
        case 'geohash' : return 'GEOHASH';
        case 'releasedate' : return 'Release (Date)';
        case 'releasetime' : return 'Release (Time)';
        case 'rat' : return 'RAT';
        case 'operator' : return 'Operator';
        case 'locationupdatetype': return 'LU Type';

        default: return data;
    }
}

export const hiddenFields = [
    'id',
    'smstext',
    'maxsmsconcated',
    'concatsmsrefnumber',
    'seqnoofcurrentsms',
    'sgwipaddress',
    'servingnodeipaddress',
    'accesspointnameni',
    'servedpdppdnaddress',
    'accountcode',
    'drccallid',
    'smsuserdatatype',
    'systemtype',
    'chargedparty',
    'subscribercategory',
    'usertype',
    'recordnumber',
    'partyrelcause',
    'chargelevel',
    'zonecode',
    'recordingentity',
    'seizureordeliverytime',
    'causeforterm',
    'diagnostics',
    'sequencenumber',
    'networkcallreference',
    'mscaddress',
    'timebucket',
    'calledportedflag',
    'callerportedflag',
    'callreference',
    'cellid',
    'firstmccmnc',  
    'globalcallreference',
    'locationnum',
    'lastmccmnc',
    'lac',
    'intermediatemccmnc',
    'imeistatus',
    'address',  
];