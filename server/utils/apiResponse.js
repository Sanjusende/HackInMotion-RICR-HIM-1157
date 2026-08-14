class ApiResponse {
  /**
   * Standardized Success Response
   */
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Standardized Error Response
   */
  static error(res, error = "Internal Server Error", statusCode = 500, details = null) {
    const payload = {
      success: false,
      error
    };
    if (details) {
      payload.details = details;
    }
    return res.status(statusCode).json(payload);
  }
}

export default ApiResponse;
