function formatResponse(json) {
  delete json.password; // if there is a password, delete it from response
  return { data: json };
}

module.exports = formatResponse;
