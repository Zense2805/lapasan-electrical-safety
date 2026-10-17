/**
 * OPTIONAL survey starter for approved USTP/Barangay Lapasan project personnel.
 * Paste into https://script.google.com/ in a PROJECT-CONTROLLED Google account.
 * Run createLapasanDraftForm once. Permissions to create Google Forms and Sheets
 * will be requested by Google. Do not run until the account owner and data
 * stewardship arrangements have been approved.
 *
 * It creates a CLOSED draft Form, and a response Spreadsheet in the same
 * account. It does NOT publish, collect responses, or change the GitHub website.
 *
 * Warning: The survey and consent notice MUST be revised and approved before
 * opening. Do NOT use as an emergency-reporting channel.
 */
function createLapasanDraftForm() {
  var title = 'DRAFT - Barangay Lapasan Household Electrical Safety Assessment';
  var form = FormApp.create(title);
  form.setDescription(
    'DRAFT FOR PROJECT REVIEW ONLY. This proposed survey supports the assessment ' +
    'and mapping of community vulnerability to electrically induced fire in ' +
    'Barangay Lapasan, Cagayan de Oro City. Participation must be voluntary. ' +
    'Do not inspect live electrical equipment to answer. No individual home will ' +
    'be publicly identified. REPLACE THIS TEXT with the formally approved ' +
    'participant information and consent notice, data retention/privacy details, ' +
    'official contact channels, and urgent referral instructions before use.'
  );
  form.setConfirmationMessage('Thank you. This survey is for community planning, not an inspection or emergency-reporting service.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(false);
  form.setAcceptingResponses(false);

  form.addSectionHeaderItem().setTitle('Consent - REPLACE WITH APPROVED NOTICE');
  form.addCheckboxItem()
    .setTitle('I have read the approved participant information and voluntarily consent to this assessment.')
    .setHelpText('If you do not consent, please close the survey. Do not continue.')
    .setChoiceValues(['I agree to take part voluntarily'])
    .setRequired(true);

  form.addSectionHeaderItem().setTitle('A. General survey area and dwelling context');
  form.addTextItem()
    .setTitle('Approved general survey area code (optional)')
    .setHelpText('Use ONLY a code provided by the approved project team. Do not enter house numbers, street addresses, personal names or coordinates.')
    .setRequired(false);
  form.addMultipleChoiceItem().setTitle('Dwelling arrangement (self-reported)')
    .setChoiceValues(['Stand-alone dwelling', 'Attached or shared building', 'Other', 'Unknown', 'Prefer not to answer'])
    .setRequired(false);

  form.addSectionHeaderItem().setTitle('B. Electrical usage and already-observed warning signs');
  form.addMultipleChoiceItem().setTitle('How frequently are extension cords used for household appliances?')
    .setChoiceValues(['Frequently', 'Sometimes', 'Rarely or never', 'Unknown', 'Prefer not to answer'])
    .setRequired(false);
  var signQuestions = [
    'Have you previously noticed damaged or frayed electrical cords?',
    'Have you previously noticed plugs or outlets becoming unusually hot?',
    'Have you previously noticed repeated breaker trips or blown fuses?',
    'Have you previously noticed sparks, smoke or burning smells during electrical use?'
  ];
  signQuestions.forEach(function (q) {
    form.addMultipleChoiceItem()
      .setTitle(q)
      .setHelpText('Answer based only on existing observations. Do not approach, touch or test equipment.')
      .setChoiceValues(['Yes', 'No', 'Unknown / not sure', 'Prefer not to answer'])
      .setRequired(false);
  });
  form.addMultipleChoiceItem().setTitle('Has the household previously experienced a suspected electrical incident? (Self-report only)')
    .setChoiceValues(['Yes', 'No', 'Unknown', 'Prefer not to answer'])
    .setRequired(false);

  form.addSectionHeaderItem().setTitle('C. Preparedness and access');
  form.addMultipleChoiceItem().setTitle('Does the household know a safe emergency evacuation route?')
    .setChoiceValues(['Yes', 'No', 'Not sure', 'Prefer not to answer'])
    .setRequired(false);
  form.addMultipleChoiceItem().setTitle('Does the household know how to contact emergency services?')
    .setChoiceValues(['Yes', 'No', 'Not sure', 'Prefer not to answer'])
    .setRequired(false);
  form.addMultipleChoiceItem().setTitle('Are there general access or evacuation difficulties in the surrounding area?')
    .setChoiceValues(['Yes', 'No', 'Not sure', 'Prefer not to answer'])
    .setRequired(false);
  form.addMultipleChoiceItem().setTitle('Is obtaining qualified help for electrical concerns difficult for the household?')
    .setChoiceValues(['Yes', 'No', 'Not sure', 'Prefer not to answer'])
    .setRequired(false);

  form.addSectionHeaderItem().setTitle('D. Optional community feedback');
  form.addParagraphTextItem().setTitle('What general electrical-safety information or support would be useful? (Optional)')
    .setHelpText('Do not include names, exact home addresses, phone numbers, emergencies or private details.')
    .setRequired(false);

  // Responses must be protected by organizational permissions and policies.
  var sheet = SpreadsheetApp.create('RESTRICTED - Lapasan Electrical Safety Survey Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  Logger.log('DRAFT FORM EDIT LINK (RESTRICTED): ' + form.getEditUrl());
  Logger.log('RESPONDENT LINK (FORM CLOSED UNTIL APPROVED): ' + form.getPublishedUrl());
  Logger.log('RESPONSE SPREADSHEET (RESTRICTED): ' + sheet.getUrl());
  Logger.log('IMPORTANT: Do not share editor/Sheet links on the public website.');
}
