function formatResponse(json, message = 'Success!') {
  delete json.password; // if there is a password, delete it from response
  return { message, data: json };
}

module.exports = formatResponse;
