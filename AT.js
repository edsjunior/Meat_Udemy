var arrReleaseCorporate = [];

// Get all active or closed corporate releases that have planned finish dates on or after today 
var grReleaseCorporate = new GlideRecord('u_release_corporate');
grReleaseCorporate.addEncodedQuery('stateIN3,8^end_date>=javascript:gs.beginningOfToday()');
grReleaseCorporate.query();

while (grReleaseCorporate.next()) {
    arrReleaseCorporate.push(grReleaseCorporate.sys_id.getDisplayValue());
}

// Clear capacity data for all these releases and squads
var grPlannedUtilization = new GlideRecord('u_cm_planned_capacity');
grPlannedUtilization.addQuery('u_release_corporate', 'IN', arrReleaseCorporate.join(','));
grPlannedUtilization.query();


if (grPlannedUtilization.next()){

  var snQuery = 'extpar_u_business_supportISNOTEMPTY';
  snQuery += ('^extpar_u_business_support.u_it_community=' + grPlannedUtilization.u_it_community);
  snQuery += ('^extpar_u_business_support.u_it_release_train=' + grPlannedUtilization.u_it_release_train);
  snQuery += ('^extpar_u_business_support.u_it_squad=' + grPlannedUtilization.u_it_squad);
  snQuery += ('^tccb_u_data>=' + grPlannedUtilization.u_release_corporate.start_date);
  snQuery += ('^tccb_u_data<=' + grPlannedUtilization.u_release_corporate.end_date);
  _realizedCapacity(snQuery,'sn');

  var atQuery = 'extpar_u_application_supportISEMPTY';
  atQuery += ('^extpar_u_application_support.u_it_community=' + grPlannedUtilization.u_it_community);
  atQuery += ('^extpar_u_application_support.u_it_release_train=' + grPlannedUtilization.u_it_release_train);
  atQuery += ('^extpar_u_application_support.u_it_squad=' + grPlannedUtilization.u_it_squad);
  atQuery += ('^tccb_u_data>=' + grPlannedUtilization.u_release_corporate.start_date);
  atQuery += ('^tccb_u_data<=' + grPlannedUtilization.u_release_corporate.end_date);
  _realizedCapacity(atQuery,'at');

  var osQuery = 'extpar_u_rm_osISNOTEMPTY';
  osQuery += ('^extpar_u_rm_osISNOTEMPTY.u_it_community=' + grPlannedUtilization.u_it_community);
  osQuery += ('^extpar_u_rm_osISNOTEMPTY.u_it_release_train=' + grPlannedUtilization.u_it_release_train);
  osQuery += ('^extpar_u_rm_osISNOTEMPTY.u_it_squad=' + grPlannedUtilization.u_it_squad);
  osQuery += ('^tccb_u_data>=' + grPlannedUtilization.u_release_corporate.start_date);
  osQuery += ('^tccb_u_data<=' + grPlannedUtilization.u_release_corporate.end_date);
  _realizedCapacity(osQuery,'os');

  var featureQuery = 'extpar_u_featureISNOTEMPTY';
  featureQuery += ('^extpar_u_feature.u_it_community=' + grPlannedUtilization.u_it_community);
  featureQuery += ('^extpar_u_feature.u_it_release_train=' + grPlannedUtilization.u_it_release_train);
  featureQuery += ('^extpar_u_feature.u_it_squad=' + grPlannedUtilization.u_it_squad);
  featureQuery += ('^tccb_u_data>=' + grPlannedUtilization.u_release_corporate.start_date);
  featureQuery += ('^tccb_u_data<=' + grPlannedUtilization.u_release_corporate.end_date);
  _realizedCapacity(featureQuery,'ft');
  
}


function _realizedCapacity (query,type) {

  var hoursHF = 0;
  var hoursHI = 0;
  var timeCardParent = new GlideRecord('u_time_card_parent');
  timeCardParent.addEncodedQuery(query);
  timeCardParent.query();

  while (timeCardParent.next()) {
      if (timeCardParent.usr_u_member_type == 'HF'){
        hoursHF += parseFloat(timeCardParent.tccb_u_regular_hours_decimal);
      }else{
        hoursHI += parseFloat(timeCardParent.tccb_u_regular_hours_decimal);
      }
      
      sumSN += timeCardParent.tccb_u_regular_hours_decimal
  }

  if(type == "at"){
    grPlannedUtilization.u_realized_at_hi = hoursHI;
    grPlannedUtilization.u_realized_at_hf = hoursHF;
    grPlannedUtilization.u_realized_features_total = parseFloat(hoursHI) + parseFloat(hoursHF);
    //grPlannedUtilization.update();

  } else if (type =="sn"){
    grPlannedUtilization.u_realized_sn_hi = hoursHI;
    grPlannedUtilization.u_realized_sn_hf = hoursHF;
    grPlannedUtilization.u_realized_sn_total = parseFloat(hoursHI) + parseFloat(hoursHF);
    //grPlannedUtilization.update();

  } else if (type == "os"){
    grPlannedUtilization.u_realized_os_hi = hoursHI;
    grPlannedUtilization.u_realized_os_hf = hoursHF;
    grPlannedUtilization.u_realized_os_total = parseFloat(hoursHI) + parseFloat(hoursHF);
    //grPlannedUtilization.update();

  } else if (type == "ft"){
    grPlannedUtilization.u_realized_features_hi = hoursHI;
    grPlannedUtilization.u_realized_features_hf = hoursHF;
    grPlannedUtilization.u_realized_features_total = parseFloat(hoursHI) + parseFloat(hoursHF);
    //grPlannedUtilization.update();
  }
  

} 